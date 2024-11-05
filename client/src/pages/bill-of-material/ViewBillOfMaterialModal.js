import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { formatDistance } from 'utils/format-date';
import CustomDialog from 'components/CustomDialog';
import { fetchBillOfMaterial, fetchUpdateMaterialQuantity } from 'store/slices/billOfMaterial/fetchBillOfMaterial';
import { Button } from '../../../node_modules/@mui/material/index';
import { setMessage } from 'store/slices/util/utilSlice';

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
    valueGetter: (value) => formatDistance(value?.value)
  }
];

export default function ViewBillOfMaterialModal({ id, visible, onClose }) {
  const dispatch = useDispatch();
  const [billOfMaterial, setBillOfMaterial] = useState({
    loading: true,
    error: null,
    data: {}
  });

  useEffect(() => {
    if (!visible) return;
    dispatch(fetchBillOfMaterial({ id })).then((action) => {
      if (action.type === 'bom/fetch/fulfilled') {
        setBillOfMaterial({ loading: false, data: action.payload.data?.billOfMaterial, error: null });
      } else {
        setBillOfMaterial({ loading: false, data: {}, error: action.payload.error });
      }
    });

    return () => {
      setBillOfMaterial({ loading: true, error: null, data: {} });
    };
  }, [visible]);

  const updateMaterialQuantity = async ({ id, quantity, ...rest }, oldRow) => {
    if (isNaN(parseFloat(quantity))) {
      dispatch(setMessage({ type: 'error', message: 'Quantity not a number!' }));
      return oldRow;
    }
    const { type, payload } = await dispatch(fetchUpdateMaterialQuantity({ id, quantity })).then((action) => {
      if (type === 'bom/material/update/fetch/fulfilled') {
        return action.payload?.data?.bomItem;
      } else {
        dispatch(setMessage({ type: 'error', message: payload?.data?.error || 'Failed! Quantity not updated!' }));
        return oldRow;
      }
    });
  };

  return (
    <CustomDialog
      visible={visible}
      onClose={onClose}
      maxWidth="lg"
      title="Bill Of Material"
      actions={[
        <Button key="1" onClick={() => {}} variant="contained" color="success">
          Fulfill Bill of Material
        </Button>
      ]}
    >
      {!billOfMaterial.loading && <DataGrid autoHeight density="compact" hideFooter rows={[billOfMaterial?.data]} columns={bomColumn} />}
      {!billOfMaterial.loading && (
        <DataGrid
          autoHeight
          disableRowSelectionOnClick
          showCellVerticalBorder
          processRowUpdate={updateMaterialQuantity}
          density="compact"
          hideFooter
          rows={billOfMaterial?.data?.materials}
          columns={materialColumns}
        />
      )}
    </CustomDialog>
  );
}
