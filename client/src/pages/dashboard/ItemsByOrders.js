import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Typography, LinearProgress } from '@mui/material';
import styled from '@mui/system/styled';
import { useSelector } from 'react-redux';
import { dashboardIsLoadingSelector, dashboardStatsSelector } from 'store/slices/dashboard/dashboardSelector';

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
  const statsIsLoading = useSelector(dashboardIsLoadingSelector);
  const stats = useSelector(dashboardStatsSelector);

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        disableRowSelectionOnClick
        loading={statsIsLoading}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        hideFooterPagination={true}
        getRowId={(row) => `${row.name}-${row.generated}-${row.confirmed}`}
        rows={stats?.ordersByItem || []}
        columns={columns}
      />
    </div>
  );
}
