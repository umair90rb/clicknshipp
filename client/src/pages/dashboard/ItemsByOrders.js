import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, LinearProgress } from '@mui/material';
import styled from '@mui/system/styled';

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
    flex: 1
  },
  {
    field: 'confirmed',
    headerName: 'Confirmed',
    flex: 1
  },

  {
    field: 'percentage',
    headerName: 'Percentage%',
    flex: 1,
    valueGetter: (params) => `${(params.row.confirmed / params.row.generated) * 100}%`,
    renderCell: (params) => {
      return (
        <>
          <BorderLinearProgress color="success" variant="determinate" value={(params.row.confirmed / params.row.generated) * 100} />
          <Typography variant="body2" color="text.secondary">{`${(params.row.confirmed / params.row.generated) * 100}%`}</Typography>
        </>
      );
    }
  }
];

export default function ItemsByOrders({ items }) {
  return (
    <div style={{ height: '50vh', width: '100%' }}>
      <DataGrid
        hideFooterPagination={true}
        getRowId={(row) => `${row.name}-${row.generated}-${row.confirmed}`}
        rows={items}
        columns={columns}
      />
    </div>
  );
}
