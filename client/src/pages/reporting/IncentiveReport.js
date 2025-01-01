import React from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';
import { reportDataSelector, reportIsLoadingSelector } from 'store/slices/report/reportSelector';
import { toSentence } from 'utils/string-utils';
import { styled } from '@mui/material/styles';
import ReportingGrid from './components/ReportingGrid';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover
  },
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: '#ffffff'
  },
  [`& .${gridClasses.columnHeader}`]: {
    position: 'sticky',
    top: 0,
    zIndex: 1000, // Ensure the header is above other content
    backgroundColor: 'white' // Set a background color to prevent transparency issues
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
  }
];

export default function IncentiveReport() {
  const data = useSelector(reportDataSelector);
  let withAgentColumns = [...columns];

  if (data && data.length) {
    const { name, quantity, ...restColumns } = data[0];
    const columnArray = Object.keys(restColumns);
    for (let k of columnArray) {
      if (!/confirmed|delivered/g.test(k)) {
        continue;
      }
      const confirmKey = `${k}`;
      withAgentColumns.push({
        field: confirmKey,
        headerName: `${toSentence(k.split('_').join(' '))}`,
        flex: 1,
        valueGetter: (params) => {
          if (params.row.id === 'TOTAL') {
            return params.row[`${confirmKey}_total`];
          }
          return params.value;
        }
      });
    }
  }

  return (
    <ReportingGrid
      heading="Incentive Report"
      description="Incentive report provide you no of items that each agents confirmed and no of items that are delivered"
      rows={data}
      columns={withAgentColumns}
    />
  );
}
