import React from 'react';
import { useSelector } from 'react-redux';
import { reportDataSelector } from 'store/slices/report/reportSelector';
import ReportingGrid from './components/ReportingGrid';

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    description: 'Name of product',
    flex: 1,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.label;
      }
      return params.value;
    }
  },
  {
    field: 'foc',
    headerName: 'FOC',
    description: 'No of FOC(Free of Cost) items that dispatched in selected period',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalFOC;
      }
      return params.value;
    }
  },
  {
    field: 'postex',
    headerName: 'POSTEX',
    description: 'Name of courier service',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalPostex;
      }
      return params.value;
    }
  },
  {
    field: 'tcs',
    headerName: 'TCS',
    description: 'Name of courier service',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalTCS;
      }
      return params.value;
    }
  },
  {
    field: 'deawoo',
    headerName: 'Daewoo',
    description: 'Name of courier service',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalDeawoo;
      }
      return params.value;
    }
  },
  {
    field: 'trax',
    headerName: 'TRAX',
    description: 'Name of courier service',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalTrax;
      }
      return params.value;
    }
  },
  {
    field: 'leopard',
    headerName: 'LCS',
    description: 'Name of courier service',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalLeopard;
      }
      return params.value;
    }
  },
  {
    field: 'mnp',
    headerName: 'M&P',
    description: 'Name of courier service',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalMNP;
      }
      return params.value;
    }
  },
  {
    field: 'manual',
    headerName: 'Manual',
    description: 'Name of courier service',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalManual;
      }
      return params.value;
    }
  },
  {
    field: 'callcourier',
    headerName: 'Call Courier',
    description: 'Name of courier service',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalCallCourier;
      }
      return params.value;
    }
  }
];

export default function FOCReport() {
  const data = useSelector(reportDataSelector);

  return (
    <ReportingGrid
      heading="FOC Products"
      description="FOC is a list of free of cost products that dispatched with orders without any cost"
      rows={data}
      columns={columns}
    />
  );
}
