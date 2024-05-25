import React from 'react';
import { Typography, Card, CardContent, Link } from '@mui/material';

export default function OldOrders({ oldOrders = [] }) {
  return (
    <Card sx={{ minWidth: 275, mt: 1 }}>
      <CardContent>
        <Typography variant="h5">Previous Orders</Typography>

        {oldOrders.map((order, index) => (
          <Link component="button" key={index} href={`${order.id}`} underline="hover">
            {`${order.order_number || order.id},`}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
