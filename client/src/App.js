// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { setPath, setMessage } from 'store/slices/util/utilSlice';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { utilMessageSelector } from 'store/slices/util/utilSelector';

const App = () => {
  const dispatch = useDispatch();
  // const { pathname } = useLocation();
  const { message, type } = useSelector(utilMessageSelector);
  // useEffect(() => dispatch(setPath(pathname)), []);

  const handleExited = () => dispatch(setMessage({ message: '', type: '' }));

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
