import { Typography, Stack, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatDistance, formatDate, isItToday } from 'utils/format-date';

const OrderRow = ({ order, onNavigate }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/order/${id}`);
    onNavigate && onNavigate();
  };
  const { id, order_number, status, items, address, customer, user, createdAt } = order || {};
  return (
    <Stack
      component="div"
      sx={{
        ':hover': {
          background: '#ECECEC'
        },
        background: isItToday(createdAt) ? '#FFD580' : undefined,
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
        | {customer?.name || ''} Placed at {formatDate('MMM dd', createdAt)}, {formatDistance(createdAt)} | Assigned to{' '}
        <Typography component="span" variant="h5">
          {user?.name || 'None'}
        </Typography>{' '}
        Items: {items?.reduce((pv, cv) => `${cv.name}/${cv.quantity} ${pv}`, '')}, Address: {address?.address1}, City:{' '}
        <Typography component="span" variant="h5">
          {address?.city}{' '}
        </Typography>
        <Link component="button" onClick={handleNavigate}>
          View Details
        </Link>
      </Typography>
    </Stack>
  );
};

export default OrderRow;
