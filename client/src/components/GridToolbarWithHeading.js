import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HoverDescription from './HtmlTooltip';

export default function GridToolbarWithHeading({ heading = '', description = '' }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <GridToolbarFilterButton />
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ flexGrow: 1 }}>
        <Typography variant="h5" align="center" color="primary">
          {heading}
        </Typography>
        <HoverDescription
          heading={`What is ${heading} report?`}
          description={`${description}. Reports data is according to selected period and filters. To get detail about each column in report, place cursor on column header text`}
        >
          <InfoOutlinedIcon fontSize="small" color="primary" />
        </HoverDescription>
      </Box>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}
