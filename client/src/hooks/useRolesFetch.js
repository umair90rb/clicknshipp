import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { aclRolesFetchStatusSelector } from 'store/slices/acl/aclSelector';
import { fetchAllRoles } from 'store/slices/acl/fetchACL';
import fetchStatus from 'constants/fetchStatuses';

export default function useRolesFetch() {
  const dispatch = useDispatch();
  const rolesFetchStatus = useSelector(aclRolesFetchStatusSelector);
  const fetchRoles = React.useCallback(() => dispatch(fetchAllRoles()), []);

  React.useEffect(() => {
    if (rolesFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllRoles());
    }
  }, []);

  return { refresh: fetchRoles };
}
