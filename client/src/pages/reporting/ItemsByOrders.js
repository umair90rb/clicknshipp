import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, LinearProgress } from '@mui/material';
import styled from '@mui/system/styled';
import { useSelector } from 'react-redux';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';
import { reportDataSelector, reportIsLoadingSelector } from 'store/slices/report/reportSelector';

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
    field: 'name',
    headerName: 'Name',
    flex: 3
  },
  {
    field: 'generated',
    headerName: 'Generated',
    flex: 0.5
  },
  {
    field: 'confirmed',
    headerName: 'Confirmed',
    flex: 0.5
  },

  {
    field: 'no_pick',
    headerName: 'No Pick',
    flex: 0.5
  },
  {
    field: 'cancel',
    headerName: 'Cancel',
    flex: 0.5
  },
  {
    field: 'percentage',
    headerName: 'Percentage%',
    flex: 1,
    valueGetter: (params) => `${(params.row.confirmed / params.row.generated) * 100}%`,
    renderCell: (params) => {
      const percentage = ((params.row.confirmed / params.row.generated) * 100).toFixed(2);
      return (
        <>
          <BorderLinearProgress color="success" variant="determinate" value={percentage} />
          <Typography variant="body2" color="text.secondary">{`${percentage}%`}</Typography>
        </>
      );
    }
  },
  {
    field: 'postex',
    headerName: 'POSTEX',
    flex: 0.5
  },
  {
    field: 'tcs',
    headerName: 'TCS',
    flex: 0.5
  },
  {
    field: 'deawoo',
    headerName: 'Daewoo',
    flex: 0.5
  },
  {
    field: 'trax',
    headerName: 'TRAX',
    flex: 0.5
  },
  {
    field: 'leapard',
    headerName: 'LCS',
    flex: 0.5
  },
  {
    field: 'callcourier',
    headerName: 'Call CS',
    flex: 0.5
  }
];

export default function ItemsByOrders() {
  const reportIsLoading = useSelector(reportIsLoadingSelector);
  const data = useSelector(reportDataSelector);

  const renderToolbar = () => <GridToolbarWithHeading heading="Products in orders" />;

  if (reportIsLoading) {
    return null;
  }

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        disableRowSelectionOnClick
        loading={reportIsLoading}
        slots={{ toolbar: renderToolbar, noRowsOverlay: CustomNoRowsOverlay }}
        hideFooterPagination={true}
        getRowId={(row) => `${row.name}-${row.generated}-${row.confirmed}`}
        rows={data || []}
        columns={columns}
      />
    </div>
  );
}
