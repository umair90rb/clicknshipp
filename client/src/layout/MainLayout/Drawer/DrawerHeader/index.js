import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Stack, Chip } from '@mui/material';
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from 'components/Logo';
import { getEnvs } from 'api/getEnv';
const { HEROKU_RELEASE_VERSION, REACT_APP_HEROKU_RELEASE_VERSION } = getEnvs();

const DrawerHeader = ({ open }) => {
  const theme = useTheme();

  return (
    <DrawerHeaderStyled theme={theme} open={open}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Logo />
        <Chip
          label={HEROKU_RELEASE_VERSION ? `v${HEROKU_RELEASE_VERSION}` : `v${REACT_APP_HEROKU_RELEASE_VERSION}`}
          size="small"
          sx={{ height: 16, '& .MuiChip-label': { fontSize: '0.625rem', py: 0.25 } }}
          component="span"
          onClick={() => {
            // throw new Error('This is your first error!');
            alert(`App current version is ${process.env.HEROKU_RELEASE_VERSION || REACT_APP_HEROKU_RELEASE_VERSION || 'unknown'}`, null, 2);
          }}
        />
      </Stack>
    </DrawerHeaderStyled>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool
};

export default DrawerHeader;
