import { PERMISSIONS } from 'constants/permissions-and-roles';
import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchFilteredUsers } from 'store/slices/user/fetchUser';

export default function useFilteredUsersFetch({ agentsOnly = false, brand = [] }) {
  const dispatch = useDispatch();
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const body = {};
  if (agentsOnly) {
    body['permissions'] = [PERMISSIONS.PERMISSION_ASSIGN_ORDERS];
  }

  if (brand.length) {
    body['brand'] = brand;
  }

  React.useEffect(() => {
    setLoading(true);
    dispatch(
      fetchFilteredUsers({
        body
      })
    ).then(({ type, payload }) => {
      if (type === 'users/filtered/fetch/fulfilled') {
        setUsers(payload?.data.users);
        setError(null);
        setLoading(false);
      } else {
        setUsers([]);
        setError(payload?.data.error || 'Error in fetching filtered assignee');
        setLoading(false);
      }
    });
  }, []);

  return { users, loading, error };
}
