import fetchStatus from 'constants/fetchStatuses';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cityFetchStatusSelector } from 'store/slices/city/citySelector';
import { fetchAllCities } from 'store/slices/city/fetchCity';

export default function useCitiesFetch() {
  const dispatch = useDispatch();
  const citiesFetchStatus = useSelector(cityFetchStatusSelector);

  useEffect(() => {
    if (citiesFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllCities());
    }
  }, []);
}
