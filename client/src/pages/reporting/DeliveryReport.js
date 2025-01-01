import React from 'react';
import { useSelector } from 'react-redux';
import { reportDataSelector } from 'store/slices/report/reportSelector';
import ReportingGrid from './components/ReportingGrid';

const columns = [
  {
    field: 'courier.name',
    flex: 1,
    headerName: 'Name'
  },
  {
    field: 'total',
    flex: 1,
    headerName: 'Total Booked'
  },
  {
    field: 'delivered',
    flex: 1,
    headerName: 'Delivered'
  },
  {
    field: 'in_progress',
    flex: 1,
    headerName: 'In Progress'
  },
  {
    field: 'returned',
    flex: 1,
    headerName: 'Returned'
  },
  {
    field: 'in_error',
    flex: 1,
    headerName: 'In Error'
  },
  {
    field: 'canceled',
    flex: 1,
    headerName: 'Booking Canceled'
  },
  {
    field: 'percentage',
    headerName: 'Percentage%',
    flex: 1,
    valueGetter: (params) => {
      if (params.row.total > 0) {
        return `${((params.row.delivered / params.row.total) * 100).toFixed(2)}%`;
      }
      return '';
    }
  }
];

export default function DeliveryReport() {
  const data = useSelector(reportDataSelector);

  return (
    <ReportingGrid
      heading="Delivery Report"
      description="Delivery report give you insight about the courier services and provide order delivery ratio"
      rows={data}
      columns={columns}
    />
  );
}
