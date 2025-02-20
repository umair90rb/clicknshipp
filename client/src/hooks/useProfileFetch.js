import { useEffect } from 'react';
import { useDispatch } from '../../node_modules/react-redux/es/exports';
import { fetchProfile } from 'store/index';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
import location from 'utils/location';

export default function useProfileFetch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      dispatch(fetchProfile());
      return;
    }
    navigate(location.loginUrl());
  }, []);
}
