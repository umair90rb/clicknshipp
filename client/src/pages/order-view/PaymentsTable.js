import React from 'react';
import { TableRow, TableCell, Table, TableBody } from '@mui/material';

const OrderPaymentRow = ({ payment }) => {
  return (
    <TableRow key={payment.id} hover>
      <TableCell align="right">{payment.type}</TableCell>
      <TableCell align="right">{payment.bank}</TableCell>
      <TableCell align="right">{payment.tid}</TableCell>
      <TableCell align="right">{payment.amount}</TableCell>
      <TableCell align="right">{payment.note}</TableCell>
    </TableRow>
  );
};

const OrderPayments = ({ orderPayments }) => {
  return (
    <Table>
      <TableBody>
        <TableRow hover>
          <TableCell align="right">Received/Pending</TableCell>
          <TableCell align="right">Bank</TableCell>
          <TableCell align="right">TID</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell align="right">Note</TableCell>
        </TableRow>
        {orderPayments && orderPayments.map((payment) => <OrderPaymentRow key={payment.id} payment={payment} />)}
      </TableBody>
    </Table>
  );
};

export default OrderPayments;
