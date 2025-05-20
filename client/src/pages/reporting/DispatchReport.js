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
    field: 'courier',
    headerName: 'Name',
    description: 'Name of courier partner',
    flex: 1
  },
  {
    field: 'dispatched',
    headerName: 'Total Dispatched',
    description: 'No of total dispatched parcels',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalDispatched;
      }
      return params.value;
    }
  },
  //   {
  //     field: 'charge',
  //     headerName: 'Single Parcel Charge',
  //     description: 'Enter charge of single parcel',
  //     flex: 0.5,
  //     editable: true,
  //   },
  {
    field: 'charges',
    headerName: 'Total Charges',
    description: 'Charges of total dispatched parcels',
    flex: 0.5
  }
];

export default function DispatchReport() {
  const data = useSelector(reportDataSelector);

  return (
    <ReportingGrid
      heading="Dispatched Report"
      description="Dispatched report of all courier with total dispatched parcels and charges"
      rows={data}
      columns={columns}
    />
  );
}
