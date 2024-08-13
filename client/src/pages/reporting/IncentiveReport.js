import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';
import { reportDataSelector, reportIsLoadingSelector } from 'store/slices/report/reportSelector';

const columns = [
  {
    field: 'item',
    headerName: 'Item',
    flex: 1
  }
];

export default function IncentiveReport() {
  const reportIsLoading = useSelector(reportIsLoadingSelector);
  const data = useSelector(reportDataSelector);
  let withAgentColumns = [];

  const renderToolbar = () => <GridToolbarWithHeading heading="Incentive Report" />;

  if (data && data.length) {
    const firstRow = data[0];
    const { item, ...restFields } = firstRow;
    withAgentColumns = [
      ...columns,
      ...Object.keys(restFields).map((k) => ({
        field: k,
        headerName: k.toUpperCase(),
        flex: 0.25
      }))
    ];
  }

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        autoHeight
        hideFooterPagination
        loading={reportIsLoading}
        slots={{ toolbar: renderToolbar, noRowsOverlay: CustomNoRowsOverlay }}
        getRowId={(row) => `${Math.random().toString().split('.')[1]}`}
        rows={data}
        columns={withAgentColumns}
      />
    </div>
  );
}
