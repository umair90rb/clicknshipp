import fetchStatus from 'constants/fetchStatuses';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cityFetchStatusSelector } from 'store/slices/city/citySelector';
import { fetchAllCities } from 'store/slices/city/fetchCity';

export default function useCitiesFetch() {
  const dispatch = useDispatch();
  const citiesFetchStatus = useSelector(cityFetchStatusSelector);
  const fetchCities = useCallback(() => dispatch(fetchAllCities()), []);

  useEffect(() => {
    if (citiesFetchStatus !== fetchStatus.SUCCESS) {
      fetchCities();
    }
  }, []);

  return { refresh: fetchCities };
}
