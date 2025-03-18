import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUser } from 'store/slices/user/fetchUser';
import { userFetchStatusSelector } from 'store/slices/user/userSelector';
import fetchStatus from 'constants/fetchStatuses';

export default function useUsersFetch() {
  const dispatch = useDispatch();
  const usersFetchStatus = useSelector(userFetchStatusSelector);
  const fetchUsers = useCallback(() => dispatch(fetchAllUser()), []);

  useEffect(() => {
    if (usersFetchStatus !== fetchStatus.SUCCESS) {
      fetchUsers();
    }
  }, []);

  return { refresh: fetchUsers };
}
