import { Typography, Stack, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { isToday, format, formatDistanceToNow } from 'date-fns';

const OrderRow = ({ order, onNavigate }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/order/${id}`);
    onNavigate && onNavigate();
  };
  const { id, order_number, status, items, customer, user, createdAt } = order || {};
  return (
    <Stack
      component="div"
      onClick={handleNavigate}
      sx={{
        ':hover': {
          background: '#ECECEC'
        },
        background: isToday(createdAt) ? '#FFD580' : undefined,
        width: '100%',
        my: 0.5,
        p: 0.5,
        borderRadius: 2,
        border: '0px solid black'
      }}
    >
      <Typography component="p" variant="h6" ml={1}>
        #{order_number} | Status:{' '}
        <Typography component="span" variant="h5">
          {status}
        </Typography>{' '}
        | {customer?.name || ''} Placed at {format(createdAt, 'MMM dd')}, {formatDistanceToNow(createdAt)} ago | Assigned to{' '}
        <Typography component="span" variant="h5">
          {user?.name || ''}
        </Typography>{' '}
        Items: {items?.reduce((pv, cv) => `${cv.name}/${cv.quantity} ${pv}`, '')}
      </Typography>
    </Stack>
  );
};

export default OrderRow;
