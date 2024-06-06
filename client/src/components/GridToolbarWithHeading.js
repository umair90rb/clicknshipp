import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

export default function GridToolbarWithHeading({ heading = '' }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <GridToolbarFilterButton />
      <Box alignItem="center" justifyContent="center" sx={{ flexGrow: 1 }}>
        <Typography variant="h6" align="center">
          {heading}
        </Typography>
      </Box>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}
