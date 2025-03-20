import fetchStatus from 'constants/fetchStatuses';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSupplier } from 'store/slices/supplier/fetchSupplier';
import { supplierFetchStatusSelector } from 'store/slices/supplier/supplierSelector';

export default function useSupplierFetch() {
  const dispatch = useDispatch();
  const suppliersFetchStatus = useSelector(supplierFetchStatusSelector);
  const fetchSuppliers = useCallback(() => dispatch(fetchAllSupplier()), []);

  useEffect(() => {
    if (suppliersFetchStatus !== fetchStatus.SUCCESS) {
      fetchSuppliers();
    }
  }, []);

  return { refresh: fetchSuppliers };
}
