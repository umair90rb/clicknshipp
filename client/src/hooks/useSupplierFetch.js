import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllSupplier } from 'store/slices/supplier/fetchSupplier';

export default function useSupplierFetch() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllSupplier());
  }, []);
}
