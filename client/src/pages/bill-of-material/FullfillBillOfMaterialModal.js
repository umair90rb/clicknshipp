import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
// import formatDate, { formatDistance } from 'utils/format-date';
import CustomDialog from 'components/CustomDialog';
import { fetchFullfilBillOfMaterial } from 'store/slices/billOfMaterial/fetchBillOfMaterial';
// import { setMessage } from 'store/slices/util/utilSlice';
import { useSelector } from 'react-redux';
import { locationFetchStatusSelector, locationListSelector } from 'store/slices/location/locationSelector';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllLocation } from 'store/slices/location/fetchLocation';
import { Button, FormHelperText, Grid, FormControl, FormLabel, Select, MenuItem } from '@mui/material';
import { fetchGetBatches } from 'store/slices/batch/fetchBatch';
import { GridMultiDropdownSelect } from './GridMultiDropdownSelect';
import { setMessage } from 'store/slices/util/utilSlice';

// function GridMultiSelectComponent(props) {
//   return (
//     <GridMultiDropdownSelect options={(props.batches[props.row.raw.id] || []).map((d) => d.batch_number)} value={[]} onChange={() => {}} />
//   );
// }

const column = (batches) => [
  {
    field: 'id',
    headerName: 'ID#'
  },
  {
    field: 'raw',
    headerName: 'Raw Material',
    flex: 1,
    valueGetter: (value) => `${value?.row?.raw?.name}`
  },
  // {
  //   field: 'batch_no',
  //   headerName: 'Add Batches'
  //   editable: true,
  //   renderEditCell: (params) => <GridMultiSelectComponent {...{ ...params, batches }} />
  // },
  {
    field: 'quantity',
    headerName: 'Quantity'
  },
  {
    field: 'unit_of_measure',
    headerName: 'Unit'
  }
];

export default function FullfilBillOfMaterialModal({ id, bomMaterials = [], visible, onClose, onFulfilled }) {
  const dispatch = useDispatch();

  const locationFetchStatus = useSelector(locationFetchStatusSelector);
  const locations = useSelector(locationListSelector);
  // const locationIsLoading = locationFetchStatus === fetchStatus.REQUEST;

  // const [materials, setMaterials] = useState([...bomMaterials]);
  const [locationId, setLocationId] = useState(null);

  const [fetchFullfilBillOfMaterialState, setFullfilFetchBillOfMaterialState] = useState({
    loading: false,
    error: null,
    data: {}
  });

  // const [fetchBatchesState, setBatchesState] = useState({
  //   loading: true,
  //   error: null,
  //   data: {}
  // });

  useEffect(() => {
    if (!visible) return;
    if (locationFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllLocation());
    }

    return () => {
      setLocationId(null);
      setFullfilFetchBillOfMaterialState({ loading: false, error: null, data: {} });
    };
  }, [visible]);

  // useEffect(() => {
  //   if (!visible || !locationId) return;
  //   dispatch(fetchGetBatches({ body: { location_id: locationId, item_type: 'raw_material', ids: materials.map((m) => m.raw.id) } })).then(
  //     ({ type, payload }) => {
  //       if (type === 'batch/get/fetch/fulfilled') {
  //         setBatchesState({ loading: false, error: null, data: payload.data.batches });
  //       } else {
  //         setBatchesState({ loading: false, error: payload.error.message, data: {} });
  //       }
  //     }
  //   );

  //   return () => {
  //     setLocationId(null);
  //     setBatchesState({ loading: true, error: null, data: {} });
  //   };
  // }, [locationId]);

  // const addBatchesForMaterial = async (updatedRow, oldRow) => {
  //   return updatedRow;
  // };

  // const onProcessRowUpdateError = (e) => console.log(e);

  const fullfilBOM = () => {
    if (!locationId) return;
    setFullfilFetchBillOfMaterialState({ loading: true, error: null, data: {} });
    return dispatch(fetchFullfilBillOfMaterial({ id, locationId })).then(({ type, payload }) => {
      console.log(type, payload);
      if (type === 'bom/fullfil/fetch/fulfilled') {
        setFullfilFetchBillOfMaterialState({ loading: false, error: null, data: payload.data });
        setTimeout(() => onFulfilled(), 100);
      } else {
        setFullfilFetchBillOfMaterialState({ loading: false, error: payload.error, data: {} });
        dispatch(setMessage({ type: 'error', message: payload.error }));
      }
    });
  };

  // const fullfilBOM = () => {
  //   setFullfilFetchBillOfMaterialState((st) => ({ ...st, loading: true }));
  //   dispatch(fetchFullfilBillOfMaterial({ id })).then((action) => {
  //     if (action.type === 'bom/addBatches/fulfilled') {
  //       setFullfilFetchBillOfMaterialState({ loading: false, data: action.payload.data?.billOfMaterial, error: null });
  //     } else {
  //       setFullfilFetchBillOfMaterialState({ loading: false, data: {}, error: action.payload.error });
  //     }
  //   });
  // };

  return (
    <CustomDialog
      visible={visible}
      onClose={onClose}
      maxWidth="sm"
      title="Select Location"
      actions={[
        { text: 'Fulfill Bill of Material', onClick: fullfilBOM, disabled: fetchFullfilBillOfMaterialState.loading, color: 'success' }
      ]}
    >
      <Grid item sx={3} md={3} lg={3}>
        <FormControl fullWidth margin="normal">
          <FormLabel id="location_id">Select Store</FormLabel>
          <Select
            size="small"
            labelId="location_id"
            id="location_id_select"
            value={locationId}
            name="location_id"
            onChange={(e) => setLocationId(e.target.value)}
            error={!locationId}
          >
            {locations.map(({ id, name }, index) => (
              <MenuItem key={index} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
          {!locationId && (
            <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
              Please select store!
            </FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* <DataGrid
        autoHeight
        disableRowSelectionOnClick
        showCellVerticalBorder
        hideFooter
        density="comfortable"
        // onProcessRowUpdateError={onProcessRowUpdateError}
        // processRowUpdate={addBatchesForMaterial}
        rows={materials}
        columns={column()}
      /> */}
    </CustomDialog>
  );
}
