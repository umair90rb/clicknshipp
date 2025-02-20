import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllUnitOfMeasure } from 'store/slices/unitOfMeasure/fetchUnitOfMeasure';

export default function useUOMFetch() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUnitOfMeasure());
  }, []);
}
