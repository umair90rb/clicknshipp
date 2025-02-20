import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { setMessage } from 'store/slices/util/utilSlice';
import { Typography, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { utilMessageSelector } from 'store/slices/util/utilSelector';
import useProfileFetch from 'hooks/useProfileFetch';
import Modals from 'modals/index';

const App = () => {
  const dispatch = useDispatch();
  const { message, type, sticky } = useSelector(utilMessageSelector);
  const handleExited = () => dispatch(setMessage({ message: '', type: '' }));

  useProfileFetch();

  return (
    <ThemeCustomization>
      <ScrollTop>
        <Snackbar
          onClose={handleExited}
          TransitionProps={{ onExited: handleExited }}
          autoHideDuration={!sticky && 5000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={!!message}
        >
          <Alert onClose={handleExited} variant="filled" severity={type || 'info'}>
            <Typography variant="h6" color="white">
              {message}
            </Typography>
          </Alert>
        </Snackbar>
        <Routes />
        <Modals />
      </ScrollTop>
    </ThemeCustomization>
  );
};

export default App;
