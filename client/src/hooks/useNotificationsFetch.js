import fetchStatus from 'constants/fetchStatuses';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllNotification } from 'store/slices/notification/fetchNotification';
import {
  notificationFetchStatusSelector,
  notificationLimitSelector,
  notificationOffsetSelector
} from 'store/slices/notification/notificationSelector';

export default function useNotificationsFetch(action, resource) {
  const dispatch = useDispatch();
  const limit = useSelector(notificationLimitSelector);
  const offset = useSelector(notificationOffsetSelector);
  const notificationFetchStatus = useSelector(notificationFetchStatusSelector);
  const fetchNotification = useCallback(
    () => dispatch(fetchAllNotification({ body: { action, resource, limit, offset } })),
    [limit, offset, action, resource]
  );

  useEffect(() => {
    if (notificationFetchStatus !== fetchStatus.SUCCESS) {
      fetchNotification();
    }
  }, [limit, offset]);

  return { refresh: fetchNotification };
}
