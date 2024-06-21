import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Link, LinearProgress } from '@mui/material';
import styled from '@mui/system/styled';
import { useDispatch, useSelector } from 'react-redux';
import {
  reportAgentDataSelector,
  reportAgentIsLoadingSelector,
  reportEndPeriodSelector,
  reportStartPeriodSelector
} from 'store/slices/report/reportSelector';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';
import location from 'utils/location';
import { setOrderFilters } from 'store/slices/order/orderSlice';
import { useNavigate } from 'react-router-dom';

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

export default function AgentsReports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reportIsLoading = useSelector(reportAgentIsLoadingSelector);
  const startPeriod = useSelector(reportStartPeriodSelector);
  const endPeriod = useSelector(reportEndPeriodSelector);
  const data = useSelector(reportAgentDataSelector);

  const renderToolBar = () => <GridToolbarWithHeading heading="Agent Report" />;
  const linkClicked = (id, status) => {
    dispatch(
      setOrderFilters([
        { column: 'agent', op: 'Text is exactly', value: id },
        { column: 'status', op: 'Text is exactly', value: status },
        { column: 'assignedAt', op: 'Greater than or equal to', value: startPeriod },
        { column: 'assignedAt', op: 'Less than or equal to', value: endPeriod }
      ])
    );
    navigate('/order/all');
  };

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
      renderCell: (params) => {
        return (
          <Button onClick={() => linkClicked(params.row.user.id, 'Assigned')} variant="text" size="small">
            {params.row.total}
          </Button>
        );
      }
    },
    {
      field: 'confirmed',
      headerName: 'Confirmed',
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Button onClick={() => linkClicked(params.row.user.id, 'Confirmed')} variant="text" size="small">
            {params.row.confirmed}
          </Button>
        );
      }
    },
    {
      field: 'no_pick',
      headerName: 'No Pick',
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Button onClick={() => linkClicked(params.row.user.id, 'No Pick')} variant="text" size="small">
            {params.row.no_pick}
          </Button>
        );
      }
    },
    {
      field: 'cancel',
      headerName: 'Cancel',
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Button onClick={() => linkClicked(params.row.user.id, 'Cancel')} variant="text" size="small">
            {params.row.cancel}
          </Button>
        );
      }
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
