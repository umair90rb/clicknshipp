import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, LinearProgress } from '@mui/material';
import styled from '@mui/system/styled';
import { useSelector } from 'react-redux';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';
import { reportDataSelector, reportIsLoadingSelector } from 'store/slices/report/reportSelector';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover // Light gray for even rows
  },
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: '#ffffff' // White for odd rows
  }
}));

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: '14px',
  width: '88px',
  borderRadius: '7px',
  backgroundColor: ' #ebf5fb',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#2196f3',
    transition: 'none',
    transformOrigin: 'left'
  }
}));

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
  const reportIsLoading = useSelector(reportIsLoadingSelector);
  const data = useSelector(reportDataSelector);

  const renderToolbar = () => <GridToolbarWithHeading heading="Products in orders" />;

  if (reportIsLoading) {
    return null;
  }

  return (
    <div style={{ width: '100%', height: '75vh' }}>
      <StyledDataGrid
        hideFooterPagination
        checkboxSelection={false}
        loading={reportIsLoading}
        slots={{ toolbar: renderToolbar, noRowsOverlay: CustomNoRowsOverlay }}
        rows={data}
        columns={columns}
      />
    </div>
  );
}
