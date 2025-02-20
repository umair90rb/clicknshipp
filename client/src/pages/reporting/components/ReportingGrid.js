import { DataGrid } from '@mui/x-data-grid';
import styled from '@mui/system/styled';
import { useSelector } from 'react-redux';
import { reportDataSelector, reportIsLoadingSelector } from 'store/slices/report/reportSelector';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  // '& .MuiDataGrid-row:nth-of-type(odd)': {
  //   backgroundColor: '#ffffff'
  // },
  '& .MuiDataGrid-columnHeaders': {
    position: 'sticky',
    top: 60,
    backgroundColor: 'grey',
    zIndex: theme.zIndex.mobileStepper - 1,
    fontSize: 16,
    color: 'white'
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: theme.palette.action.hover
  },
  '& .MuiDataGrid-virtualScroller': {
    marginTop: '0 !important'
  },
  '& .MuiDataGrid-main': {
    overflow: 'visible'
  },
  '--DataGrid-overlayHeight': '300px'
}));

function renderToolbar() {
  return <GridToolbarWithHeading heading={this.heading} description={this.description} />;
}

export default function ReportingGrid({ heading, description, ...rest }) {
  const reportIsLoading = useSelector(reportIsLoadingSelector);
  const reportData = useSelector(reportDataSelector);

  if (reportData && Array.isArray(reportData) && !reportData.length) {
    return 'No data to show with selected period and filters!';
  }

  return (
    <StyledDataGrid
      disableRowSelectionOnClick
      hideFooter
      hideFooterPagination
      hideFooterSelectedRowCount
      hideFooterRowCount
      checkboxSelection={false}
      loading={reportIsLoading}
      // slots={{ noRowsOverlay: CustomNoRowsOverlay }}
      // sx={{ '--DataGrid-overlayHeight': '300px' }}
      sx={{
        '& .MuiDataGrid-columnHeaders': {
          fontSize: '16px',
          fontWeight: 'bold'
        },
        '& .MuiDataGrid-cell': {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      }}
      slots={{ toolbar: renderToolbar.bind({ heading, description }), noRowsOverlay: CustomNoRowsOverlay }}
      getRowId={(row) => `${Math.random().toString().split('.')[1]}`}
      {...rest}
    />
  );
}
