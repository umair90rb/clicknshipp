import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { reportDataSelector } from 'store/slices/report/reportSelector';
import ReportingGrid from './components/ReportingGrid';

const columns = [
  {
    field: 'chanel',
    headerName: 'Channel',
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
    field: 'agent',
    headerName: 'Agents',
    flex: 0.5
  },
  {
    field: 'orders',
    headerName: 'Orders Generated',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalOrders;
      }
      return params.value;
    }
  },
  {
    field: 'duplicated',
    headerName: 'Orders Duplicated',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalDuplicatedOrders;
      }
      return params.value;
    }
  },
  {
    field: 'confirmed',
    headerName: 'Orders Confirmed',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalConfirmedOrders;
      }
      return params.value;
    }
  },
  {
    field: 'order_confirmed_cod',
    headerName: 'Confirmed Orders COD',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalConfirmedOrdersCOD;
      }
      return params.value;
    }
  },
  {
    field: 'unit_generated',
    headerName: 'Units Generated',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnitGenerated;
      }
      return params.value;
    }
  },
  {
    field: 'unit_confirmed',
    headerName: 'Units Confirmed',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnitConfirmed;
      }
      return params.value;
    }
  },
  {
    field: 'unit_duplicated',
    headerName: 'Units Duplicated',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnitDuplicated;
      }
      return params.value;
    }
  },
  {
    field: 'cancel',
    headerName: 'Orders Cancel',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalCancelOrders;
      }
      return params.value;
    }
  },
  {
    field: 'no_pick',
    headerName: 'Orders No Pick',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalNoPickOrders;
      }
      return params.value;
    }
  }
];

export default function ChannelReport() {
  const data = useSelector(reportDataSelector);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    cancel: false,
    no_pick: false
  });

  return (
    <ReportingGrid
      heading="Chanel Report"
      description="Chanel report provide detail about orders processed by each chanel"
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={setColumnVisibilityModel}
      rows={data}
      columns={columns}
    />
  );
}
