import fetchStatus from 'constants/fetchStatuses';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chanelFetchStatusSelector } from 'store/slices/chanel/chanelSelector';
import { fetchAllChanel } from 'store/slices/chanel/fetchChanel';

export default function useChannelsFetch() {
  const dispatch = useDispatch();
  const chanelsFetchStatus = useSelector(chanelFetchStatusSelector);

  useEffect(() => {
    if (chanelsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllChanel());
    }
  }, []);
}
