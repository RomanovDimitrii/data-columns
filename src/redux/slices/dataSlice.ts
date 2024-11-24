import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface DevData {
  front: number;
  back: number;
  db: number;
}

interface ServerData {
  title: string;
  dev: DevData;
  test: DevData;
  prod: DevData;
  norm: number;
}

interface DataState {
  currentData: ServerData | null;
  cache: { [url: string]: ServerData };
  loading: boolean;
  error: string | null;
  isAllZero: boolean;
}

const initialState: DataState = {
  currentData: null,
  cache: {},
  loading: false,
  error: null,
  isAllZero: true
};

export const fetchData = createAsyncThunk<ServerData, string>(
  'data/fetchData',
  async (url, { getState }) => {
    const { data } = getState() as { data: DataState };
    if (data.cache[url]) {
      return data.cache[url];
    }
    const response = await axios.get<ServerData>(url);
    return response.data;
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setCurrentData(state, action: PayloadAction<ServerData>) {
      state.currentData = action.payload;
      const isZero = (data: DevData | number): boolean => {
        if (typeof data === 'number') return data === 0;
        return Object.values(data).every(value => value === 0);
      };

      state.isAllZero =
        isZero(action.payload.dev) &&
        isZero(action.payload.test) &&
        isZero(action.payload.prod) &&
        isZero(action.payload.norm);
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.cache[action.meta.arg] = action.payload;
        state.currentData = action.payload;

        const isZero = (data: DevData | number): boolean => {
          if (typeof data === 'number') return data === 0;
          return Object.values(data).every(value => value === 0);
        };

        state.isAllZero =
          isZero(action.payload.dev) &&
          isZero(action.payload.test) &&
          isZero(action.payload.prod) &&
          isZero(action.payload.norm);
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching data';
      });
  }
});

export const { setCurrentData } = dataSlice.actions;
export default dataSlice.reducer;
