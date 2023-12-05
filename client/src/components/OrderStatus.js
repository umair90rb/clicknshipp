import { Stack, Typography } from '@mui/material';
import Dot from 'components/@extended/Dot';

export default OrderStatus = ({ status, color }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Dot color={color} />
    <Typography>{status}</Typography>
  </Stack>
);

OrderStatus.propTypes = {
  status: PropTypes.string,
  color: PropTypes.oneOf(['error', 'primary', 'success', 'warning'])
};
