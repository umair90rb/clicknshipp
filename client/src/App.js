// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { setMessage } from 'store/slices/util/utilSlice';
import { Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { utilMessageSelector } from 'store/slices/util/utilSelector';
import useFetchProfile from 'hooks/useFetchProfile';

const App = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector(utilMessageSelector);
  const handleExited = () => dispatch(setMessage({ message: '', type: '' }));

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
