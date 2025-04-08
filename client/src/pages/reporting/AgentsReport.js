import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import {
  reportBrandSelector,
  reportChanelSelector,
  reportDataSelector,
  reportEndPeriodSelector,
  reportStartPeriodSelector
} from 'store/slices/report/reportSelector';
import { setOrderFilters } from 'store/slices/order/orderSlice';
import { useNavigate } from 'react-router-dom';
import ReportingGrid from './components/ReportingGrid';
import GridLinearProgress from './components/GridLinearProgress';

export default function AgentsReports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const startPeriod = useSelector(reportStartPeriodSelector);
  const endPeriod = useSelector(reportEndPeriodSelector);
  const reportChanelFilter = useSelector(reportChanelSelector);
  const reportBrandFilter = useSelector(reportBrandSelector);
  const data = useSelector(reportDataSelector);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    user_id: false
  });

  const linkClicked = (id, status) => {
    const _filters = [
      { column: 'assignedAt', op: 'Greater than or equal to', value: startPeriod },
      { column: 'assignedAt', op: 'Less than or equal to', value: endPeriod }
    ];
    if (id && Array.isArray(id) && id.length) {
      _filters.push({ column: 'agent', op: 'Text is any', value: id });
    }
    if (status.length) {
      _filters.push({ column: 'status', op: 'Text is any', value: status });
    }
    if (reportChanelFilter.length) {
      _filters.push({ column: 'chanel_id', op: 'Text is any', value: reportChanelFilter });
    }
    if (reportBrandFilter.length) {
      _filters.push({ column: 'brand_id', op: 'Text is any', value: reportBrandFilter });
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
            <Button
              onClick={() =>
                linkClicked(
                  data.map((row) => row.user_id).filter((uid) => uid === null),
                  []
                )
              }
              variant="text"
              size="small"
            >
              {params.row.grandTotal}
            </Button>
          );
        }
        return (
          <Button onClick={() => linkClicked([params.row.user_id], [])} variant="text" size="small">
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
            <Button
              onClick={() =>
                linkClicked(
                  data.map((row) => row.user_id).filter((uid) => uid === null),
                  ['Confirmed']
                )
              }
              variant="text"
              size="small"
            >
              {params.row.totalConfirmed}
            </Button>
          );
        }
        return (
          <Button onClick={() => linkClicked([params.row.user_id], ['Confirmed'])} variant="text" size="small">
            {params.row.confirmed}
          </Button>
        );
      }
    },
    {
      field: 'assigned',
      headerName: 'Assigned',
      flex: 0.5,
      valueGetter: (params) => {
        if (params.row.id === 'TOTAL') {
          return params.row.totalAssigned;
        }
        return params.value;
      },
      renderCell: (params) => {
        if (params.row.id === 'TOTAL') {
          return (
            <Button
              onClick={() =>
                linkClicked(
                  data.map((row) => row.user_id),
                  ['Assigned']
                )
              }
              variant="text"
              size="small"
            >
              {params.row.totalAssigned}
            </Button>
          );
        }
        return (
          <Button onClick={() => linkClicked([params.row.user_id], ['Assigned'])} variant="text" size="small">
            {params.row.assigned}
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
            <Button
              onClick={() =>
                linkClicked(
                  data.map((row) => row.user_id).filter((uid) => uid === null),
                  ['No Pick']
                )
              }
              variant="text"
              size="small"
            >
              {params.row.totalNoPick}
            </Button>
          );
        }
        return (
          <Button onClick={() => linkClicked([params.row.user_id], ['No Pick'])} variant="text" size="small">
            {params.row.no_pick}
          </Button>
        );
      }
    },
    {
      field: 'payment_pending',
      headerName: 'Payment Pending',
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
            <Button
              onClick={() =>
                linkClicked(
                  data.map((row) => row.user_id).filter((uid) => uid === null),
                  ['Payment Pending']
                )
              }
              variant="text"
              size="small"
            >
              {params.row.totalPaymentPending}
            </Button>
          );
        }
        return (
          <Button onClick={() => linkClicked([params.row.user_id], ['Payment Pending'])} variant="text" size="small">
            {params.row.payment_pending}
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
            <Button
              onClick={() =>
                linkClicked(
                  data.map((row) => row.user_id).filter((uid) => uid === null),
                  ['Cancel']
                )
              }
              variant="text"
              size="small"
            >
              {params.row.totalCancel}
            </Button>
          );
        }
        return (
          <Button onClick={() => linkClicked([params.row.user_id], ['Cancel'])} variant="text" size="small">
            {params.row.cancel}
          </Button>
        );
      }
    },
    {
      field: 'percentage',
      headerName: 'Percentage%',
      flex: 0.5,
      renderCell: (params) => {
        let percentage = ((params.row.confirmed / params.row.total) * 100).toFixed(2);
        if (params.row.id === 'TOTAL') {
          percentage = ((params.row.totalConfirmed / params.row.grandTotal) * 100).toFixed(2);
          return <GridLinearProgress percentage={percentage} />;
        }
        return <GridLinearProgress percentage={percentage} />;
      }
    }
  ];

  return (
    <ReportingGrid
      heading="Agent Report"
      description="Agent report provide you details about agent performance"
      rows={data || []}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={setColumnVisibilityModel}
      columns={columns}
    />
  );
}
