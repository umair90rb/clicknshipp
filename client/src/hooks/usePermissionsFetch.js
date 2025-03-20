import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { aclPermissionsFetchStatusSelector } from 'store/slices/acl/aclSelector';
import { fetchAllPermissions } from 'store/slices/acl/fetchACL';
import fetchStatus from 'constants/fetchStatuses';

export default function usePermissionsFetch() {
  const dispatch = useDispatch();
  const permissionsFetchStatus = useSelector(aclPermissionsFetchStatusSelector);
  const fetchPermissions = useCallback(() => dispatch(fetchAllPermissions()), []);

  useEffect(() => {
    if (permissionsFetchStatus !== fetchStatus.SUCCESS) {
      fetchPermissions();
    }
  }, []);

  return { refresh: fetchPermissions };
}
