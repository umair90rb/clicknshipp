import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
// import { Typography, LinearProgress } from '@mui/material';
import styled from '@mui/system/styled';
import { useSelector } from 'react-redux';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';
import { reportDataSelector, reportIsLoadingSelector } from 'store/slices/report/reportSelector';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover // Light gray for even rows
  },
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: '#ffffff' // White for odd rows
  }
}));

// const BorderLinearProgress = styled(LinearProgress)(() => ({
//   height: '14px',
//   width: '88px',
//   borderRadius: '7px',
//   backgroundColor: ' #ebf5fb',
//   '& .MuiLinearProgress-bar': {
//     backgroundColor: '#2196f3',
//     transition: 'none',
//     transformOrigin: 'left'
//   }
// }));

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 3,
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
  const reportIsLoading = useSelector(reportIsLoadingSelector);
  const data = useSelector(reportDataSelector);

  const renderToolbar = () => <GridToolbarWithHeading heading="Products in orders" />;

  if (reportIsLoading) {
    return null;
  }

  return (
    <div style={{ width: '100%', height: '75vh' }}>
      <StyledDataGrid
        hideFooterPagination
        checkboxSelection={false}
        loading={reportIsLoading}
        getRowId={(row) => `${row.name}`}
        slots={{ toolbar: renderToolbar, noRowsOverlay: CustomNoRowsOverlay }}
        rows={data}
        columns={columns}
      />
    </div>
  );
}
