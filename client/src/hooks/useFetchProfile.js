import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '../../node_modules/react-redux/es/exports';
import { fetchProfile } from 'store/index';
import fetchStatus from 'constants/fetchStatuses';
import {
  authProfileFetchStatusSelector,
  authProfileIsLoadingSelector,
  authTokenSelector,
  authUserSelector
} from 'store/slices/auth/authSelector';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';
import location from 'utils/location';
import useAuth from './useAuth';

const useFetchProfile = () => {
  const dispatch = useDispatch();
  const profileFetchStatus = useSelector(authProfileFetchStatusSelector);
  const token = useSelector(authTokenSelector);
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  useEffect(() => {
    dispatch(fetchProfile());
  }, []);

  useEffect(() => {
    if (profileFetchStatus === fetchStatus.FAILURE || (profileFetchStatus === fetchStatus.SUCCESS && token)) {
      logout();
      navigate(location.loginUrl());
    }
    if (profileFetchStatus === fetchStatus.SUCCESS && token) {
      login(token);
      navigate(location.dashboardUrl());
    }
  }, [profileFetchStatus]);
};

export default useFetchProfile;
