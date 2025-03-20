import fetchStatus from 'constants/fetchStatuses';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chanelFetchStatusSelector } from 'store/slices/chanel/chanelSelector';
import { fetchAllChanel } from 'store/slices/chanel/fetchChanel';

export default function useChannelsFetch() {
  const dispatch = useDispatch();
  const channelsFetchStatus = useSelector(chanelFetchStatusSelector);
  const fetchChannel = useCallback(() => dispatch(fetchAllChanel()), []);

  useEffect(() => {
    if (channelsFetchStatus !== fetchStatus.SUCCESS) {
      fetchChannel();
    }
  }, []);

  return { refresh: fetchChannel };
}
