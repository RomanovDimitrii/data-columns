import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from './redux/slices/dataSlice';
import InstanceMenu from './components/InstanceMenu/InstanceMenu';
import ColumnsDisplay from './components/ColumnsDisplay/ColumnsDisplay';
import { RootState, AppDispatch } from './redux/store';
import Legend from './components/Legend/Legend';

const DEFAULT_URL = 'https://rcslabs.ru/ttrp1.json';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentData, loading, error } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchData(DEFAULT_URL));
  }, [dispatch]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div>
      <div className="app-header">
        <h1>Количество пройденных тестов "{currentData?.title || 'Нет данных для отображения'}"</h1>
        <InstanceMenu />
      </div>
      <ColumnsDisplay />
      <Legend />
    </div>
  );
};

export default App;
