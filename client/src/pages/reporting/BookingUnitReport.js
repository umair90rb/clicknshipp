import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';
import { reportDataSelector, reportIsLoadingSelector } from 'store/slices/report/reportSelector';
import { styled } from '@mui/material/styles';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover // Light gray for even rows
  },
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: '#ffffff' // White for odd rows
  }
}));

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.label;
      }
      return params.value;
    }
  },
  {
    field: 'generated',
    headerName: 'Generated',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalGenerated;
      }
      return params.value;
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
    }
  },
  {
    field: 'unit_generated',
    headerName: 'Unit Generated',
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
    headerName: 'Unit Confirmed',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnitConfirmed;
      }
      return params.value;
    }
  },

  {
    field: 'unit_booked',
    headerName: 'Unit Booked',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnitBooked;
      }
      return params.value;
    }
  },
  {
    field: 'unit_booking_error',
    headerName: 'Unit Error',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnitBookingError;
      }
      return params.value;
    }
  },
  {
    field: 'unit_no_pick',
    headerName: 'Unit No Pick',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnitNoPick;
      }
      return params.value;
    }
  },
  {
    field: 'unit_cancel',
    headerName: 'Unit Cancel',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnitCancel;
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
    field: 'callcourier',
    headerName: 'CC',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalCallCourier;
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
    field: 'digi',
    headerName: 'Digi',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalDigi;
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
  }
];

export default function BookingUnitReport() {
  const reportIsLoading = useSelector(reportIsLoadingSelector);
  const data = useSelector(reportDataSelector);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    generated: false,
    confirmed: false,
    unit_generated: false,
    unit_no_pick: false,
    unit_cancel: false,
    callcourier: false
  });

  const renderToolbar = () => <GridToolbarWithHeading heading="Products in orders" />;

  if (reportIsLoading) {
    return null;
  }

  return (
    <div style={{ width: '100%', height: '75vh' }}>
      <StyledDataGrid
        disableRowSelectionOnClick
        hideFooterPagination
        checkboxSelection={false}
        loading={reportIsLoading}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
        getRowId={(row) => `${row.name}`}
        slots={{ toolbar: renderToolbar, noRowsOverlay: CustomNoRowsOverlay }}
        rows={data}
        columns={columns}
      />
    </div>
  );
}
