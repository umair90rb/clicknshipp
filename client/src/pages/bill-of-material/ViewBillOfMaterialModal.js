import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import formatDate, { formatDistance } from 'utils/format-date';
import CustomDialog from 'components/CustomDialog';
import {
  fetchBillOfMaterial,
  fetchFullfilBillOfMaterial,
  fetchUpdateMaterialQuantity
} from 'store/slices/billOfMaterial/fetchBillOfMaterial';
import { Button } from '@mui/material';
import { setMessage } from 'store/slices/util/utilSlice';
import FullfilBillOfMaterialModal from './FullfillBillOfMaterialModal';

const materialColumns = [
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
    editable: true
  },
  {
    field: 'unit_of_measure',
    headerName: 'Unit'
  }
];

const bomColumn = [
  {
    field: 'name',
    headerName: 'Name/Desc',
    flex: 1.25
  },
  {
    field: 'raw',
    headerName: 'For Item',
    flex: 1.5,
    valueGetter: (value) => `${value?.row?.item?.name}`
  },
  {
    field: 'quantity',
    headerName: 'Quantity'
  },
  {
    field: 'unit_of_measure',
    headerName: 'Unit'
  },
  {
    field: 'status',
    headerName: 'Status'
  },
  {
    field: 'createdAt',
    headerName: 'Requested At',
    flex: 1.25,
    valueGetter: (value) => `${formatDate(value?.value)} ${formatDistance(value?.value)}`
  }
];

export default function ViewBillOfMaterialModal({ id, visible, onClose }) {
  const dispatch = useDispatch();
  const [fetchBillOfMaterialState, setFetchBillOfMaterialState] = useState({
    loading: true,
    error: null,
    data: {}
  });

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
        visible={visible}
        onClose={onClose}
        maxWidth="lg"
        title="Bill Of Material"
        actions={[
          <Button
            key="1"
            disabled={fetchBillOfMaterialState.data?.status === 'Fulfilled'}
            onClick={() => setShowFullfilModal(true)}
            variant="contained"
            color="success"
          >
            Fulfill Bill of Material
          </Button>
        ]}
      >
        {!fetchBillOfMaterialState.loading && (
          <DataGrid autoHeight getRowHeight={() => 'auto'} hideFooter rows={[fetchBillOfMaterialState?.data]} columns={bomColumn} />
        )}
        {!fetchBillOfMaterialState.loading && (
          <DataGrid
            autoHeight
            disableRowSelectionOnClick
            showCellVerticalBorder
            hideFooter
            getRowHeight={() => 'auto'}
            onProcessRowUpdateError={onProcessRowUpdateError}
            processRowUpdate={updateMaterialQuantity}
            rows={fetchBillOfMaterialState?.data?.materials}
            columns={materialColumns}
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
