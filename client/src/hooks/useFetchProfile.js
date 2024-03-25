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
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile());
      return;
    }
    navigate(location.loginUrl());
  }, []);
};

export default useFetchProfile;
