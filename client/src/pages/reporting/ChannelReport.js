import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';
import { reportDataSelector, reportIsLoadingSelector } from 'store/slices/report/reportSelector';

const columns = [
  {
    field: 'chanel',
    headerName: 'Channel',
    flex: 0.5,
    colSpan: (params) => {
      if (params.row.id === 'TOTAL') {
        return 2;
      }
      return undefined;
    },
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.label;
      }
      return params.value;
    }
  },
  {
    field: 'agent',
    headerName: 'Agents',
    flex: 0.5
  },
  {
    field: 'orders',
    headerName: 'Orders',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalOrders;
      }
      return params.value;
    }
  },
  {
    field: 'units',
    headerName: 'Units',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnits;
      }
      return params.value;
    }
  }
];

export default function ChannelReport() {
  const reportIsLoading = useSelector(reportIsLoadingSelector);
  const data = useSelector(reportDataSelector);

  const renderToolbar = () => <GridToolbarWithHeading heading="Channel Report" />;

  console.log(data, 'report data in channel report');
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        hideFooterPagination
        loading={reportIsLoading}
        slots={{ toolbar: renderToolbar, noRowsOverlay: CustomNoRowsOverlay }}
        rows={data}
        columns={columns}
      />
    </div>
  );
}
