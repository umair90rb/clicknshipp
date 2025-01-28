import { Stack, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import getLink from 'utils/courier';
import { formatDistance, formatDate, isItToday } from 'utils/format-date';

const TextWithHeading = ({ heading, text }) => {
  return (
    text && (
      <>
        {heading}
        <b>{text}</b> |{' '}
      </>
    )
  );
};

const OrderRow = ({ order, onNavigate }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/order/${id}`);
    onNavigate && onNavigate();
  };
  const { id, order_number, status, chanel, items, address, delivery, customer, user, createdAt } = order || {};
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
      <p>
        <TextWithHeading heading="#" text={order_number} />
        <TextWithHeading heading="Channel " text={chanel?.name} />
        <TextWithHeading heading="Status " text={status} />
        <TextWithHeading heading="Customer " text={customer?.name || ''} />
        <TextWithHeading heading="Placed at " text={`${formatDate('MMM dd', createdAt)} (${formatDistance(createdAt)})`} />
        <TextWithHeading heading="Assigned to " text={user?.name || 'None'} />
        <TextWithHeading heading="Items " text={items?.reduce((pv, cv) => `${cv.name}/${cv.quantity} ${pv}`, '')} />
        <TextWithHeading heading="Address " text={address?.address1} />
        <TextWithHeading heading="City " text={address?.city} />
        <TextWithHeading heading="Delivery Status " text={delivery?.status} />
        <TextWithHeading heading="Booked with " text={delivery?.courier} />
        {delivery?.cn && (
          <Link target="_blank" href={getLink(delivery?.cn, delivery?.courier)} underline="hover">
            CN#: {delivery?.cn}
          </Link>
        )}
        <Link component="button" onClick={handleNavigate}>
          View Details
        </Link>
      </p>
    </Stack>
  );
};

export default OrderRow;
