import { DataGrid } from '@mui/x-data-grid';
import GridCustomToolbar from './GridCustomToolbar';
import CustomNoRowsOverlay from './GridNoRowCustomOverlay';

export default function CustomGrid({
  columns = [],
  rows = [],
  loading = false,
  withRefresh,
  customActions = [],
  showQuickFilter = true,
  ...props
}) {
  return (
    <DataGrid
      slots={{ toolbar: GridCustomToolbar, noRowsOverlay: CustomNoRowsOverlay }}
      slotProps={{
        toolbar: {
          showQuickFilter,
          withRefresh,
          customActions
        }
      }}
      loading={loading}
      pageSizeOptions={[25, 50, 75, 100]}
      rows={rows}
      columns={columns}
      {...props}
      //   sx={{ '--DataGrid-overlayHeight': '300px'}}
    />
  );
}
