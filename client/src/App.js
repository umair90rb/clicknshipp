// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { setMessage } from 'store/slices/util/utilSlice';
import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { utilMessageSelector } from 'store/slices/util/utilSelector';
import useFetchProfile from 'hooks/useFetchProfile';
import { useEffect } from 'react';
import { authTokenSelector } from 'store/slices/auth/authSelector';
import { useNavigate } from '../node_modules/react-router-dom/dist/index';
import location from 'utils/location';

const App = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector(utilMessageSelector);
  const token = useSelector(authTokenSelector);
  const navigate = useNavigate();
  const handleExited = () => dispatch(setMessage({ message: '', type: '' }));
  useEffect(() => {
    if (!token) {
      navigate(location.loginUrl());
    }
  }, [token]);

  useFetchProfile();

  return (
    <ThemeCustomization>
      <ScrollTop>
        <Snackbar
          onClose={handleExited}
          TransitionProps={{ onExited: handleExited }}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={!!message}
        >
          <Alert severity={type}>{message}</Alert>
        </Snackbar>
        <Routes />
      </ScrollTop>
    </ThemeCustomization>
  );
};

export default App;
