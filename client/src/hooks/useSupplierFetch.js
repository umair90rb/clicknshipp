import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllCities } from 'store/slices/city/fetchCity';

export default function useSupplierFetch() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCities());
  }, []);
}
