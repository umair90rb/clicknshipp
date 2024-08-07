import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, LinearProgress } from '@mui/material';
import styled from '@mui/system/styled';
import { useDispatch, useSelector } from 'react-redux';
import {
  reportDataSelector,
  reportEndPeriodSelector,
  reportFetchStatusSelector,
  reportIsLoadingSelector,
  reportStartPeriodSelector
} from 'store/slices/report/reportSelector';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';
import { setOrderFilters } from 'store/slices/order/orderSlice';
import { useNavigate } from 'react-router-dom';
import fetchStatus from 'constants/fetchStatuses';

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
  const reportIsLoading = useSelector(reportIsLoadingSelector);
  const reportFetchStatus = useSelector(reportFetchStatusSelector);
  const startPeriod = useSelector(reportStartPeriodSelector);
  const endPeriod = useSelector(reportEndPeriodSelector);
  const data = useSelector(reportDataSelector);
  // const _data = data;

  const renderToolBar = () => <GridToolbarWithHeading heading="Agent Report" />;
  const linkClicked = (id, status) => {
    const _filters = [
      { column: 'agent', op: 'Text is exactly', value: id },
      { column: 'assignedAt', op: 'Greater than or equal to', value: startPeriod },
      { column: 'assignedAt', op: 'Less than or equal to', value: endPeriod }
    ];
    if (status.length) {
      _filters.push({ column: 'status', op: 'Text is any', value: status });
    }
    dispatch(setOrderFilters(_filters));
    navigate('/order/all');
  };

  const columns = [
    {
      field: 'user_id',
      headerName: 'User ID',
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
      field: 'name',
      headerName: 'Name',
      flex: 0.5,
      valueGetter: (params) => params.row?.user?.name || ''
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 0.5,
      valueGetter: (params) => {
        if (params.row.id === 'TOTAL') {
          return params.row.grandTotal;
        }
        return params.value;
      },
      renderCell: (params) => {
        if (params.row.id === 'TOTAL') {
          return (
            <Button variant="text" size="small">
              {params.row.grandTotal}
            </Button>
          );
        }
        return (
          <Button onClick={() => linkClicked(params.row.user.id, [])} variant="text" size="small">
            {params.row.total}
          </Button>
        );
      }
    },
    {
      field: 'confirmed',
      headerName: 'Confirmed',
      flex: 0.5,
      valueGetter: (params) => {
        if (params.row.id === 'TOTAL') {
          return params.row.totalConfirmed;
        }
        return params.value;
      },
      renderCell: (params) => {
        if (params.row.id === 'TOTAL') {
          return (
            <Button variant="text" size="small">
              {params.row.totalConfirmed}
            </Button>
          );
        }
        return (
          <Button onClick={() => linkClicked(params.row.user.id, ['Confirmed'])} variant="text" size="small">
            {params.row.confirmed}
          </Button>
        );
      }
    },
    {
      field: 'no_pick',
      headerName: 'No Pick',
      flex: 0.5,
      valueGetter: (params) => {
        if (params.row.id === 'TOTAL') {
          return params.row.totalNoPick;
        }
        return params.value;
      },
      renderCell: (params) => {
        if (params.row.id === 'TOTAL') {
          return (
            <Button variant="text" size="small">
              {params.row.totalNoPick}
            </Button>
          );
        }
        return (
          <Button onClick={() => linkClicked(params.row.user.id, ['No Pick', 'Payment Pending'])} variant="text" size="small">
            {params.row.no_pick}
          </Button>
        );
      }
    },
    {
      field: 'cancel',
      headerName: 'Cancel',
      flex: 0.5,
      valueGetter: (params) => {
        if (params.row.id === 'TOTAL') {
          return params.row.totalCancel;
        }
        return params.value;
      },
      renderCell: (params) => {
        if (params.row.id === 'TOTAL') {
          return (
            <Button variant="text" size="small">
              {params.row.totalCancel}
            </Button>
          );
        }
        return (
          <Button onClick={() => linkClicked(params.row.user.id, ['Cancel'])} variant="text" size="small">
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
        if (params.row.id === 'TOTAL') {
          const percentage = ((params.row.totalConfirmed / params.row.grandTotal) * 100).toFixed(2);
          return (
            <>
              <BorderLinearProgress color="success" variant="determinate" value={percentage} />
              <Typography variant="body2" color="text.secondary">{`${percentage}%`}</Typography>
            </>
          );
        }
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

  // const calculateTotal = (field) => {
  //   return data.reduce((acc, row) => acc + parseInt(row[field]), 0);
  // };

  if (reportIsLoading || reportFetchStatus === fetchStatus.IDLE) {
    return null;
  }

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        autoHeight
        disableRowSelectionOnClick
        hideFooterPagination
        loading={reportIsLoading}
        slots={{
          toolbar: renderToolBar,
          noRowsOverlay: CustomNoRowsOverlay
          // footer: (props) => <CustomFooter {...props} columns={columns} />
        }}
        rows={data || []}
        getRowId={(row) => `${row.user_id}-${row.confirmed}-${row.no_pick}`}
        columns={columns}
      />
    </div>
  );
}
