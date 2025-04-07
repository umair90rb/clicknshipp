import { DataGrid } from '@mui/x-data-grid';
import GridCustomToolbar from './GridCustomToolbar';
import CustomNoRowsOverlay from './GridNoRowCustomOverlay';

export default function CustomGrid({
  columns = [],
  rows = [],
  loading = false,
  withRefresh,
  customActions = [],
  resource = '',
  allowExport = false,
  showQuickFilter = true,
  pagination = true,
  toolbar = true,
  ...props
}) {
  return (
    <DataGrid
      slots={{ toolbar: toolbar ? GridCustomToolbar : null, noRowsOverlay: CustomNoRowsOverlay }}
      slotProps={{
        toolbar: {
          allowExport,
          showQuickFilter,
          withRefresh,
          customActions,
          resource
        }
      }}
      loading={loading}
      pageSizeOptions={[25, 50, 75, 100]}
      rows={rows}
      columns={columns}
      hideFooterPagination={!pagination}
      hideFooter={!pagination}
      {...props}
    />
  );
}
