import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllLocation } from 'store/slices/location/fetchLocation';
import { locationFetchStatusSelector } from 'store/slices/location/locationSelector';

export default function useStoreLocationFetch() {
  const dispatch = useDispatch();
  const storeLocationFetchStatus = useSelector(locationFetchStatusSelector);
  const fetchLocations = React.useCallback(() => dispatch(fetchAllLocation()), []);

  React.useEffect(() => {
    if (storeLocationFetchStatus !== fetchStatus.SUCCESS) {
      fetchLocations();
    }
  }, []);

  return { refresh: fetchLocations };
}
