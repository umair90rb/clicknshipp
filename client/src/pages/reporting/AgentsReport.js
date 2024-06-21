import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Link, LinearProgress } from '@mui/material';
import styled from '@mui/system/styled';
import { useSelector } from 'react-redux';
import { reportAgentDataSelector, reportAgentIsLoadingSelector } from 'store/slices/report/reportSelector';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';
import location from 'utils/location';

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
    flex: 0.5,
    renderCell: (params) => <Link href={`${location.allOrders()}?agent=${params.row.user.id}&status=Assigned`}>{params.row.no_pick}</Link>
  },
  {
    field: 'confirmed',
    headerName: 'Confirmed',
    flex: 0.5,
    renderCell: (params) => <Link href={`${location.allOrders()}?agent=${params.row.user.id}&status=Confirmed`}>{params.row.no_pick}</Link>
  },
  {
    field: 'no_pick',
    headerName: 'No Pick',
    flex: 0.5,
    renderCell: (params) => <Link href={`${location.allOrders()}?agent=${params.row.user.id}&status=No Pick`}>{params.row.no_pick}</Link>
  },
  {
    field: 'cancel',
    headerName: 'Cancel',
    flex: 0.5,
    renderCell: (params) => <Link href={`${location.allOrders()}?agent=${params.row.user.id}&status=Cancel`}>{params.row.cancel}</Link>
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

  if (reportIsLoading) {
    return null;
  }

  return (
    <div style={{ width: '100%' }}>
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
