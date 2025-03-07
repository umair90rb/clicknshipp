import {
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  GridToolbarExport
} from '@mui/x-data-grid';
import GridRefreshButton from './GridRefreshButton';
import Box from '@mui/material/Box';

export default function GridCustomToolbar({ withRefresh = null, allowExport = false }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      {allowExport && <GridToolbarExport />}
      <GridToolbarFilterButton />
      {withRefresh && <GridRefreshButton onClick={withRefresh} />}
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ flexGrow: 1 }}></Box>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}
