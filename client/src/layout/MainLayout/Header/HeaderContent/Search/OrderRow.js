import { Typography, Stack, Box, Chip } from '@mui/material';
import moment from '../../../../../../node_modules/moment/moment';

const OrderRow = ({ order }) => {
  const { id, order_number, status, items, customer, user, createdAt } = order || {};
  return (
    <Stack sx={{ background: '#ECECEC', width: '100%', m: 0.5, p: 0.5, borderRadius: 2, border: '0px solid black' }}>
      <Box display="flex">
        <Typography variant="body1">#{order_number}</Typography>
        <Chip key={status} label={status} sx={{ ml: 0.5, borderRadius: 5 }} size="small" variant="outlined" color="primary" />
        <Typography component="span" variant="h6" ml={1}>
          | {customer?.name || ''} Placed on {moment(createdAt).format('MMM DD, hh:mm')}
        </Typography>
        <Typography component="span" variant="h6" ml={1}>
          | Assigned to {user?.name || ''}
        </Typography>
      </Box>
      <Typography component="section" variant="h6" ml={1}>
        {items?.reduce((pv, cv) => `${cv.name}/${cv.quantity} ${pv}`, '')}
      </Typography>
    </Stack>
  );
};

export default OrderRow;
