import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from './redux/slices/dataSlice';
import InstanceMenu from './components/InstanceMenu/InstanceMenu';
import ColumnsDisplay from './components/ColumnsDisplay/ColumnsDisplay';
import { RootState } from './redux/store'; // Убедитесь в корректности пути

const DEFAULT_URL = 'https://rcslabs.ru/ttrp1.json';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { currentData, loading, error } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchData(DEFAULT_URL));
  }, [dispatch]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <div>
      <h1>Количество пройденных тестов "{currentData?.title || 'No Data Available'}"</h1>
      <ColumnsDisplay />
      <InstanceMenu />
    </div>
  );
};

export default App;
