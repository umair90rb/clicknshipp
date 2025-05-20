import React from 'react';
import { useSelector } from 'react-redux';
import { reportDataSelector } from 'store/slices/report/reportSelector';
import ReportingGrid from './components/ReportingGrid';

const columns = [
  {
    field: 'id',
    headerName: 'Sr #',
    description: 'Serial No',
    flex: 0.33
  },
  {
    field: 'name',
    headerName: 'Item Name',
    description: 'Name of Item in booked orders',
    flex: 1
  },
  {
    field: 'price',
    headerName: 'Price',
    description: 'Single Item Price',
    flex: 0.5
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    description: 'Total Quantity of items in booked orders',
    flex: 0.5
  },
  {
    field: 'value',
    headerName: 'Total Value',
    description: 'Total value calculated by multiplying price and quantity',
    flex: 0.5
  }
];

export default function BookingProductsValueReport() {
  const data = useSelector(reportDataSelector);
  return (
    <ReportingGrid
      heading="Booking Products Value Report"
      description="This report shows the total value of booked products."
      rows={data}
      columns={columns}
    />
  );
}
