import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllUser } from 'store/slices/user/fetchUser';

export default function useUsersFetch() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUser());
  }, []);
}
