import { useDispatch, useSelector } from 'react-redux';
import { aclRolesFetchStatusSelector } from 'store/slices/acl/aclSelector';
import { fetchAllRoles } from 'store/slices/acl/fetchACL';
import fetchStatus from 'constants/fetchStatuses';
import { useCallback, useEffect } from 'react';

export default function useRolesFetch() {
  const dispatch = useDispatch();
  const rolesFetchStatus = useSelector(aclRolesFetchStatusSelector);
  const fetchRoles = useCallback(() => dispatch(fetchAllRoles()), []);

  useEffect(() => {
    if (rolesFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllRoles());
    }
  }, []);

  return { refresh: fetchRoles };
}
