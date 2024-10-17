import React from 'react';
import { TableRow, TableCell, IconButton, Typography, Grid, Table, TableBody } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const OrderItemRow = ({ item, onDelete }) => {
  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="body1">
          {item.name}(Qty.{item.quantity})
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body1">Rs.{item.price}</Typography>
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
