import { Typography, Card, CardContent, Link } from '@mui/material';

const getLink = (cn, courier) => {
  switch (courier) {
    case 'leopard':
      return `https://www.leopardscourier.com/leopards-tracking`;
    case 'deawoo':
      return `https://fastex.pk`;
    case 'postex':
      return `https://merchant.postex.pk?cn=${cn}`;
    case 'tcs':
      return `https://www.tcsexpress.com/track/${cn}`;
    case 'callcourier':
      return `https://callcourier.com.pk/tracking/?tc=${cn}`;
    case 'trax':
      return `https://sonic.pk/tracking?tracking_number=${cn}`;
    case 'mnp':
      return `https://www.mulphilog.com/tracking/${cn}`;
    case 'manual':
      return '';
    default:
      return '';
  }
};

export default function Delivery({ delivery }) {
  const { courier, cn, status } = delivery || {};
  const link = getLink(cn, courier);
  console.log(link);
  return (
    <Card sx={{ minWidth: 275, mt: 1 }}>
      <CardContent>
        <Typography variant="h5">Delivery</Typography>
        <Typography sx={{ fontSize: 14 }}>Courier: {courier.toUpperCase() || 'None'}</Typography>
        {cn && (
          <Link target="_blank" href={link} underline="hover">
            CN#: {cn}
          </Link>
        )}
        <Typography sx={{ fontSize: 14 }}>Status: {status || ''}</Typography>
      </CardContent>
    </Card>
  );
}
