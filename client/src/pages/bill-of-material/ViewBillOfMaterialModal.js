import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { formatDateTime } from 'utils/format-date';
import CustomDialog from 'components/CustomDialog';
import {
  fetchBillOfMaterial,
  // fetchFullfilBillOfMaterial,
  fetchUpdateMaterialQuantity
} from 'store/slices/billOfMaterial/fetchBillOfMaterial';
import { Button, Typography, Grid } from '@mui/material';
import { setMessage } from 'store/slices/util/utilSlice';
// import { useReactToPrint } from 'react-to-print';
import FullfilBillOfMaterialModal from './FullfillBillOfMaterialModal';

const materialColumns = (isFulfilled) => [
  {
    field: 'id',
    headerName: 'ID#'
  },
  {
    field: 'raw',
    headerName: 'Raw Material',
    flex: 1.25,
    valueGetter: (value) => `${value?.row?.raw?.name}`
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    editable: !isFulfilled
  },
  {
    field: 'unit_of_measure',
    headerName: 'Unit'
  }
];

export default function ViewBillOfMaterialModal({ id, visible, onClose }) {
  const dispatch = useDispatch();
  const [fetchBillOfMaterialState, setFetchBillOfMaterialState] = useState({
    loading: true,
    error: null,
    data: {}
  });
  const isFulfilled = fetchBillOfMaterialState.data?.status === 'Fulfilled';

  // const [fetchFullfilBillOfMaterialState, setFullfilFetchBillOfMaterialState] = useState({
  //   loading: true,
  //   error: null,
  //   data: {}
  // });

  const [showFullfilModal, setShowFullfilModal] = useState(false);

  const fetchBOMDetail = () =>
    dispatch(fetchBillOfMaterial({ id })).then((action) => {
      if (action.type === 'bom/fetch/fulfilled') {
        setFetchBillOfMaterialState({ loading: false, data: action.payload.data?.billOfMaterial, error: null });
      } else {
        setFetchBillOfMaterialState({ loading: false, data: {}, error: action.payload.data?.error });
      }
    });

  useEffect(() => {
    if (!visible) return;
    fetchBOMDetail();

    return () => {
      setFetchBillOfMaterialState({ loading: true, error: null, data: {} });
    };
  }, [visible]);

  const updateMaterialQuantity = async (updatedRow, oldRow) => {
    if (isNaN(parseFloat(updatedRow.quantity))) {
      dispatch(setMessage({ type: 'error', message: 'Quantity not a number!' }));
      return oldRow;
    }
    const reason = window.prompt('Enter reason to update quantity!');
    if (!reason) {
      dispatch(setMessage({ type: 'error', message: 'To update quantity reason should be mentioned!' }));
      return oldRow;
    }
    return dispatch(
      fetchUpdateMaterialQuantity({ id: updatedRow.id, body: { quantity: updatedRow.quantity, reason, previousQuantity: oldRow.quantity } })
    ).then(({ type, payload }) => {
      if (type === 'bom/material/update/fetch/fulfilled') {
        return updatedRow;
      } else {
        dispatch(setMessage({ type: 'error', message: payload?.data?.error || 'Failed! Quantity not updated!' }));
        return oldRow;
      }
    });
  };

  const onProcessRowUpdateError = (e) => console.log(e);

  const onFulfilled = () => {
    setShowFullfilModal(false);
    fetchBOMDetail();
  };

  // const fullfilBOM = () => {
  //   return dispatch(fetchFullfilBillOfMaterial({ id })).then(({ type, payload }) => {
  //     if (type === 'bom/fullfil/fetch/fulfilled') {
  //       setFullfilFetchBillOfMaterialState({ loading: false, error: null, data: payload.data });
  //     } else {
  //       setFullfilFetchBillOfMaterialState({ loading: false, error: payload.error, data: {} });
  //     }
  //   });
  // };

  return (
    <>
      <CustomDialog
        printable
        visible={visible}
        onClose={onClose}
        maxWidth="lg"
        title="Bill Of Material"
        actions={[
          <Button key="2" disabled={isFulfilled} onClick={() => setShowFullfilModal(true)} variant="contained" color="success">
            Fulfill Bill of Material
          </Button>
        ]}
      >
        {!fetchBillOfMaterialState.loading && (
          <Grid container sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography variant="subtitle1">Bill of Material #: BOM-{fetchBillOfMaterialState?.data?.id}</Typography>
              <Typography variant="subtitle1">Description: {fetchBillOfMaterialState?.data?.comment}</Typography>
              <Typography variant="subtitle1">Requested by: {fetchBillOfMaterialState?.data?.user?.name}</Typography>
              {fetchBillOfMaterialState?.data?.item?.name && (
                <Typography variant="subtitle1">
                  For Item: {fetchBillOfMaterialState?.data?.item?.name} ({fetchBillOfMaterialState?.data?.quantity}
                  {fetchBillOfMaterialState?.data?.unit_of_measure})
                </Typography>
              )}
              <Typography variant="subtitle1">Status: {fetchBillOfMaterialState?.data?.status}</Typography>
              <Typography variant="subtitle1">Date: {formatDateTime(fetchBillOfMaterialState?.data?.createdAt)}</Typography>
            </Grid>
          </Grid>
        )}

        {!fetchBillOfMaterialState.loading && (
          <DataGrid
            autoHeight
            disableRowSelectionOnClick
            hideFooter
            getRowHeight={() => 'auto'}
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
            onProcessRowUpdateError={onProcessRowUpdateError}
            processRowUpdate={updateMaterialQuantity}
            rows={fetchBillOfMaterialState?.data?.materials}
            columns={materialColumns(isFulfilled)}
          />
        )}
      </CustomDialog>
      {/* fullfil modal */}
      <FullfilBillOfMaterialModal
        key={fetchBillOfMaterialState?.data?.materials?.length}
        id={id}
        bomMaterials={fetchBillOfMaterialState?.data?.materials}
        visible={showFullfilModal}
        onClose={() => setShowFullfilModal(false)}
        onFulfilled={onFulfilled}
      />
    </>
  );
}
