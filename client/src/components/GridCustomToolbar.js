import {
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  useGridApiContext
} from '@mui/x-data-grid';
import GridRefreshButton from './GridRefreshButton';
import Box from '@mui/material/Box';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import GridButton from './GridButton';
import { useDispatch } from 'react-redux';
import { fetchCreateNotification } from 'store/slices/notification/fetchNotification';
import { setMessage } from 'store/slices/util/utilSlice';

const CustomExportButton = ({ resource }) => {
  const apiRef = useGridApiContext();
  const dispatch = useDispatch();

  const handleExport = async () => {
    const csvOptions = {
      allColumns: true
    };
    const { type } = await dispatch(fetchCreateNotification({ body: { action: 'export', resource } }));
    if (type === 'notification/create/fetch/fulfilled') {
      apiRef.current.exportDataAsCsv(csvOptions);
    } else {
      dispatch(setMessage({ message: 'Export failed', type: 'error' }));
    }
  };

  return <GridButton text="Export" onClick={handleExport} Icon={FileDownloadOutlinedIcon} />;
};

export default function GridCustomToolbar({
  withRefresh = null,
  allowExport = false,
  showQuickFilter = true,
  customActions = null,
  resource = ''
}) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      {allowExport && <CustomExportButton resource={resource} />}
      <GridToolbarFilterButton />
      {withRefresh && <GridRefreshButton onClick={withRefresh} />}
      {customActions && customActions}
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ flexGrow: 1 }}></Box>
      {showQuickFilter && <GridToolbarQuickFilter />}
    </GridToolbarContainer>
  );
}
