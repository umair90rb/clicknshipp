import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unitOfMeasureFetchStatusSelector } from 'store/slices/unitOfMeasure/unitOfMeasureSelector';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllUnitOfMeasure } from 'store/slices/unitOfMeasure/fetchUnitOfMeasure';

export default function useUOMFetch() {
  const dispatch = useDispatch();
  const uomFetchStatus = useSelector(unitOfMeasureFetchStatusSelector);
  const fetchUOM = useCallback(() => dispatch(fetchAllUnitOfMeasure()), []);

  useEffect(() => {
    if (uomFetchStatus !== fetchStatus.SUCCESS) {
      fetchUOM();
    }
  }, []);

  return { refresh: fetchUOM };
}
