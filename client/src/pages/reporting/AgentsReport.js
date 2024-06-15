import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, LinearProgress } from '@mui/material';
import styled from '@mui/system/styled';
import { useSelector } from 'react-redux';
import { reportAgentDataSelector, reportAgentIsLoadingSelector } from 'store/slices/report/reportSelector';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';

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
    field: 'user_id',
    headerName: 'User ID',
    flex: 0.5
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 0.5,
    valueGetter: (params) => params.row.user.name || ''
  },
  {
    field: 'total',
    headerName: 'Assigned',
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
    field: 'percentage',
    headerName: 'Percentage%',
    flex: 0.5,
    valueGetter: (params) => `${(params.row.confirmed / params.row.total) * 100}%`,
    renderCell: (params) => {
      const percentage = ((params.row.confirmed / params.row.total) * 100).toFixed(2);
      return (
        <>
          <BorderLinearProgress color="success" variant="determinate" value={percentage} />
          <Typography variant="body2" color="text.secondary">{`${percentage}%`}</Typography>
        </>
      );
    }
  }
];

export default function AgentsReports() {
  const reportIsLoading = useSelector(reportAgentIsLoadingSelector);
  const data = useSelector(reportAgentDataSelector);

  const renderToolBar = () => <GridToolbarWithHeading heading="Agent Report" />;

  return (
    <div style={{ width: '100%', height: '40vh' }}>
      <DataGrid
        disableRowSelectionOnClick
        hideFooterPagination
        loading={reportIsLoading}
        slots={{ toolbar: renderToolBar, noRowsOverlay: CustomNoRowsOverlay }}
        rows={data || []}
        getRowId={(row) => `${row.user_id}-${row.confirmed}-${row.no_pick}`}
        columns={columns}
      />
    </div>
  );
}
