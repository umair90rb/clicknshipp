import React from 'react';
import { Typography, Card, CardContent, Link, Chip } from '@mui/material';

export default function DuplicateOrders({ duplicateOrders = [] }) {
  return (
    <Card sx={{ minWidth: 275, mt: 1 }}>
      <CardContent>
        <Typography variant="h5">Duplicate Orders</Typography>

        {duplicateOrders.map((order, index) => (
          <Chip
            color="warning"
            sx={{ m: 0.5 }}
            key={index}
            label={`${order.order_number} (${order.status})`}
            variant="outlined"
            component="a"
            href={order.id}
            clickable
          />
        ))}
      </CardContent>
    </Card>
  );
}
