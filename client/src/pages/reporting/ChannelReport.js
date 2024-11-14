import React, { useEffect, useState } from 'react';
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
  const reportIsLoading = useSelector(reportIsLoadingSelector);
  const data = useSelector(reportDataSelector);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    cancel: false,
    no_pick: false
  });

  const renderToolbar = () => <GridToolbarWithHeading heading="Channel Report" />;

  return (
    <div style={{ width: '100%', height: '75vh' }}>
      <StyledDataGrid
        hideFooterPagination
        disableRowSelectionOnClick
        checkboxSelection={false}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
        loading={reportIsLoading}
        slots={{ toolbar: renderToolbar, noRowsOverlay: CustomNoRowsOverlay }}
        rows={data}
        columns={columns}
      />
    </div>
  );
}
