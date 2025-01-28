import { Typography, Card, CardContent, Link } from '@mui/material';
import getLink from 'utils/courier';

export default function Delivery({ delivery }) {
  const { courier, cn, status } = delivery || {};
  const link = getLink(cn, courier);
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
