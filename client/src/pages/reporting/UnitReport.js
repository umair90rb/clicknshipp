import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, LinearProgress } from '@mui/material';
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
  // {
  //   field: 'generated',
  //   headerName: 'Generated',
  //   flex: 0.5,
  //   valueGetter: (params) => {
  //     if (params.row.id === 'TOTAL') {
  //       return params.row.totalGenerated;
  //     }
  //     return params.value;
  //   }
  // },
  // {
  //   field: 'confirmed',
  //   headerName: 'Confirmed',
  //   flex: 0.5,
  //   valueGetter: (params) => {
  //     if (params.row.id === 'TOTAL') {
  //       return params.row.totalConfirmed;
  //     }
  //     return params.value;
  //   }
  // },
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

  // {
  //   field: 'unit_booked',
  //   headerName: 'Unit Booked',
  //   flex: 0.5,
  //   valueGetter: (params) => {
  //     if (params.row.id === 'TOTAL') {
  //       return params.row.totalUnitBooked;
  //     }
  //     return params.value;
  //   }
  // },

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
    field: 'percentage',
    headerName: 'Percentage%',
    flex: 1,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalPercentage;
      }
      return `${((params.row.confirmed / params.row.generated) * 100).toFixed(2)}%`;
    },
    renderCell: (params) => {
      let percentage = ((params.row.confirmed / params.row.generated) * 100).toFixed(0);
      if (params.row.id === 'TOTAL') {
        percentage = ((params.row.totalConfirmed / params.row.totalGenerated) * 100).toFixed(0);
      }
      return (
        <>
          <BorderLinearProgress color="success" variant="determinate" value={percentage} />
          <Typography variant="body2" color="text.secondary">{`${percentage}%`}</Typography>
        </>
      );
    }
  }
  // {
  //   field: 'postex',
  //   headerName: 'POSTEX',
  //   flex: 0.5,
  //   valueGetter: (params) => {
  //     if (params.row.id === 'TOTAL') {
  //       return params.row.totalPostex;
  //     }
  //     return params.value;
  //   }
  // },
  // {
  //   field: 'tcs',
  //   headerName: 'TCS',
  //   flex: 0.5,
  //   valueGetter: (params) => {
  //     if (params.row.id === 'TOTAL') {
  //       return params.row.totalTCS;
  //     }
  //     return params.value;
  //   }
  // },
  // {
  //   field: 'deawoo',
  //   headerName: 'Daewoo',
  //   flex: 0.5,
  //   valueGetter: (params) => {
  //     if (params.row.id === 'TOTAL') {
  //       return params.row.totalDeawoo;
  //     }
  //     return params.value;
  //   }
  // },
  // {
  //   field: 'trax',
  //   headerName: 'TRAX',
  //   flex: 0.5,
  //   valueGetter: (params) => {
  //     if (params.row.id === 'TOTAL') {
  //       return params.row.totalTrax;
  //     }
  //     return params.value;
  //   }
  // },
  // {
  //   field: 'leapard',
  //   headerName: 'LCS',
  //   flex: 0.5,
  //   valueGetter: (params) => {
  //     if (params.row.id === 'TOTAL') {
  //       return params.row.totalLeapard;
  //     }
  //     return params.value;
  //   }
  // },
  // {
  //   field: 'callcourier',
  //   headerName: 'CC',
  //   flex: 0.5,
  //   valueGetter: (params) => {
  //     if (params.row.id === 'TOTAL') {
  //       return params.row.totalCallCourier;
  //     }
  //     return params.value;
  //   }
  // },
  // {
  //   field: 'mnp',
  //   headerName: 'M&P',
  //   flex: 0.5,
  //   valueGetter: (params) => {
  //     if (params.row.id === 'TOTAL') {
  //       return params.row.totalMNP;
  //     }
  //     return params.value;
  //   }
  // },
  // {
  //   field: 'manual',
  //   headerName: 'Manual',
  //   flex: 0.5,
  //   valueGetter: (params) => {
  //     if (params.row.id === 'TOTAL') {
  //       return params.row.totalManual;
  //     }
  //     return params.value;
  //   }
  // }
];

export default function UnitReport() {
  const reportIsLoading = useSelector(reportIsLoadingSelector);
  const data = useSelector(reportDataSelector);
  // const [columnVisibilityModel, setColumnVisibilityModel] = useState({
  //   generated: false,
  //   confirmed: false
  // });

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
        // columnVisibilityModel={columnVisibilityModel}
        // onColumnVisibilityModelChange={setColumnVisibilityModel}
        loading={reportIsLoading}
        slots={{ toolbar: renderToolbar, noRowsOverlay: CustomNoRowsOverlay }}
        rows={data}
        columns={columns}
      />
    </div>
  );
}
