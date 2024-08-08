import { Link, Typography, Card, CardContent } from '@mui/material';

export default function Customer({ customerId, shopify_id, name, email, phone, address1, city, zip, address_phone, address2 }) {
  return (
    <Card sx={{ minWidth: 275, mt: 1 }}>
      <CardContent>
        <Typography variant="h5">Customer</Typography>
        <Link href={`/customer/all?id=${customerId}`} underline="hover">
          Name: {name}
        </Link>
        <Typography>Customer Shopify Id: {shopify_id || 'None'}</Typography>
        <Typography>{`Email: ${email || 'None'}`}</Typography>
        <Typography>{`Phone: ${phone || 'None'}`}</Typography>

        <Typography variant="h5">Shipping Address</Typography>
        <Typography>
          Address: {address1} <br /> City:{city} <br /> Zip:{zip || 'None'}
          <br /> Phone: {address_phone} <br /> Special Instruction: {address2}
        </Typography>
      </CardContent>
    </Card>
  );
}
