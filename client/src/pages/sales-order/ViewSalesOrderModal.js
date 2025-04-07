import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import formatDate from 'utils/format-date';
import CustomDialog from 'components/CustomDialog';
import { Grid, Typography } from '@mui/material';
import { fetchSalesOrder } from 'store/slices/salesOrder/fetchSalesOrder';
import { useSelector } from '../../../node_modules/react-redux/es/exports';
import { salesOrderCreateViewIdSelector, salesOrderCreateViewModalVisibleSelector } from 'store/slices/salesOrder/salesOrderSelector';
import { setSalesOrderViewId, setSalesOrderViewModalVisible } from 'store/slices/salesOrder/salesOrderSlice';
import CustomGrid from 'components/CustomGrid';

const materialColumns = [
  {
    field: 'items',
    headerName: 'Item',
    flex: 1.25,
    valueGetter: (value) => `${value?.row?.item?.name}`
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    editable: true
  },
  {
    field: 'price',
    headerName: 'Price'
  },
  {
    field: 'total',
    headerName: 'Total',
    valueGetter: (value) => `${value?.row?.price * value?.row?.quantity}`
  }
];

export default function ViewSalesOrderModal() {
  const dispatch = useDispatch();
  const id = useSelector(salesOrderCreateViewIdSelector);
  const visible = useSelector(salesOrderCreateViewModalVisibleSelector);
  const [fetchSalesOrderState, setFetchSalesOrderState] = useState({
    loading: true,
    error: null,
    data: {}
  });

  const onClose = () => {
    dispatch(setSalesOrderViewModalVisible(false));
    dispatch(setSalesOrderViewId(null));
  };

  const handleFetchSalesOrder = () =>
    dispatch(fetchSalesOrder({ id })).then((action) => {
      if (action.type === 'salesOrder/fetch/fulfilled') {
        setFetchSalesOrderState({ loading: false, data: action.payload.data?.salesOrder, error: null });
      } else {
        setFetchSalesOrderState({ loading: false, data: {}, error: action.payload.data?.error });
      }
    });

  useEffect(() => {
    if (!visible) return;
    handleFetchSalesOrder();

    return () => {
      setFetchSalesOrderState({ loading: true, error: null, data: {} });
    };
  }, [visible]);

  return (
    <CustomDialog printable visible={visible} onClose={onClose} maxWidth="lg" title="Sales Order">
      {!fetchSalesOrderState.loading && (
        <Grid container sx={{ marginBottom: 4 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Invoice #: INV-{fetchSalesOrderState?.data?.id}</Typography>
            <Typography variant="subtitle1">Name: {fetchSalesOrderState?.data?.name}</Typography>
            <Typography variant="subtitle1">Date: {formatDate(fetchSalesOrderState?.data?.createdAt)}</Typography>
            <Typography variant="subtitle1">Payment Method: Cash</Typography>
            <Typography variant="subtitle1">Comment: {fetchSalesOrderState?.data?.comment}</Typography>
          </Grid>
        </Grid>
      )}

      {!fetchSalesOrderState.loading && (
        <CustomGrid
          disableRowSelectionOnClick
          pagination={false}
          toolbar={false}
          showQuickFilter={false}
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
          getRowHeight={() => 'auto'}
          rows={fetchSalesOrderState?.data?.items}
          columns={materialColumns}
        />
      )}

      {!fetchSalesOrderState.loading && (
        <Grid container sx={{ marginBottom: 4, marginTop: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1">
              Total: Rs.
              {fetchSalesOrderState?.data?.items?.reduce((total, item) => {
                return item.price * item.quantity + total;
              }, 0)}
              /
            </Typography>
          </Grid>
        </Grid>
      )}
    </CustomDialog>
  );
}
