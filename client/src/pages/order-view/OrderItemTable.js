import React from 'react';
import { TableRow, TableCell, IconButton, Typography, Grid, Table, TableBody } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const OrderItemRow = ({ item, onDelete }) => {
  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body1">{item.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          SKU: {item.sku}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Discount: {item.total_discount}%
        </Typography>
      </TableCell>
      <TableCell align="right">
        {item.unit_price ? (
          <Typography variant="body1">
            {`${item.unit_price} x ${item.quantity} = ${item.unit_price * item.quantity} - ${
              item.unit_price * (item.total_discount / 100)
            }` +
              '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' +
              ` Rs. ${item.quantity * item.price}`}
          </Typography>
        ) : (
          <Typography variant="body1">Rs.{item.quantity * item.price}</Typography>
        )}
      </TableCell>
    </TableRow>
  );
};

const OrderItemTable = ({ orderItems, onDelete }) => {
  return (
    <Table>
      <TableBody>{orderItems && orderItems.map((item) => <OrderItemRow key={item.id} item={item} onDelete={onDelete} />)}</TableBody>
    </Table>
  );
};

export default OrderItemTable;
