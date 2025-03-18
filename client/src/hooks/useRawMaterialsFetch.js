import { useCallback, useEffect } from 'react';
import fetchStatus from 'constants/fetchStatuses';
import { useDispatch, useSelector } from 'react-redux';
import { rawMaterialFetchStatusSelector } from 'store/slices/rawMaterial/RawMaterialSelector';
import { fetchAllRawMaterial } from 'store/slices/rawMaterial/fetchRawMaterial';

export default function useRawMaterialsFetch() {
  const dispatch = useDispatch();
  const rawMaterialsFetchStatus = useSelector(rawMaterialFetchStatusSelector);
  const fetchRawMaterials = useCallback(() => dispatch(fetchAllRawMaterial()), []);

  useEffect(() => {
    if (rawMaterialsFetchStatus !== fetchStatus.SUCCESS) {
      fetchRawMaterials();
    }
  }, []);

  return { refresh: fetchRawMaterials };
}
