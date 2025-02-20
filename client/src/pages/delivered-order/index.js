import { useEffect, useState } from 'react';
import { Typography, Grid, Box, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import {
  orderListIsLoadingSelector,
  orderListSelector,
  orderPageSelector,
  orderPageSizeSelector,
  orderSortSelector,
  orderTotalSelector
} from 'store/slices/order/orderSelector';
import { fetchAllOrder } from 'store/slices/order/fetchOrder';
import { setOrderFilters, setOrderPagination, setOrderSort } from 'store/slices/order/orderSlice';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';
import MainCard from 'components/MainCard';
import { formatDateTime } from 'utils/format-date';

const column = [
  {
    field: 'id',
    headerName: 'ID'
  },
  {
    field: 'order_number',
    headerName: 'Order#'
  },
  {
    field: 'name',
    headerName: 'Name',
    sortable: false,

    type: 'string',
    valueGetter: (param) => `${param.row.customer?.first_name || ''} ${param.row.customer?.last_name || ''}`
  },
  {
    field: 'address1',
    headerName: 'Address',
    sortable: false,
    flex: 1,
    type: 'string',

    valueGetter: (param) => param.row.address?.address1 || '',
    valueParser: (value) => value.replace(/\n/g, ' ').replace(/\s\s+/g, ' ')
  },
  {
    field: 'city',
    headerName: 'City',

    sortable: false,

    type: 'string',
    valueGetter: (param) => param.row.address?.city || ''
  },
  {
    field: 'phone',
    headerName: 'Phone',

    sortable: false,

    valueGetter: (param) => param.row.customer?.phone || ''
  },
  {
    field: 'items',
    headerName: 'Items',
    flex: 1,
    sortable: false,
    editable: false,
    type: 'string',
    valueFormatter: (params) => {
      const items = params.value;
      let itemsStr = 'None';
      if (items && items.length === 1) {
        itemsStr = `${items[0].name}/${items[0].quantity}`;
      }
      if (items && items.length > 1) {
        itemsStr = items.reduce((pv, cv) => `${cv.name}/${cv.quantity}, ${pv}`, '');
      }
      return itemsStr;
    }
  },
  {
    field: 'total_price',
    headerName: 'Amount'
  },
  {
    field: 'payments',
    headerName: 'Payments',

    sortable: false,
    editable: false,
    type: 'string',
    valueFormatter: (params) => {
      const payments = params.value;
      let paymentsStr = '';
      if (payments && payments.length > 0) {
        paymentsStr = payments.reduce(
          (pv, cv) => `${cv.label || ''} Rs.${cv.amount} TID:${cv.tid} ${cv.note || ''} ${pv ? ',' + pv : ''}`,
          ''
        );
      }
      return paymentsStr;
    }
  },
  {
    field: 'total_discounts',
    headerName: 'Discount'
  },
  {
    field: 'status',
    headerName: 'Status'
  },
  {
    field: 'courier',
    headerName: 'Courier'
  },
  {
    field: 'remarks',
    headerName: 'Remarks',
    flex: 1,
    sortable: false,
    type: 'string',
    valueGetter: (param) => param.row.remarks || '',
    valueParser: (value) => value.replace(/\n/g, ' ').replace(/\s\s+/g, ' ')
  },
  {
    field: 'tags',
    headerName: 'Tags',

    sortable: false,
    renderCell: (params) => (
      <Box>
        {(params.row.tags || '').split(',').map((tag, index) => tag && <Chip key={index} label={tag} size="small" variant="outlined" />)}
      </Box>
    )
  },
  {
    field: 'chanel',
    headerName: 'Channel',

    sortable: false,
    valueGetter: ({ value }) => (value ? value.name : '')
  },
  {
    field: 'agent',
    headerName: 'Agent',

    sortable: false,
    valueGetter: (param) => param.row.user?.name || ''
  },
  {
    field: 'createdAt',
    headerName: 'Created At',

    valueGetter: ({ value }) => formatDateTime(value, true)
  },
  {
    field: 'assignedAt',
    headerName: 'Assigned At',

    valueGetter: ({ value }) => formatDateTime(value, true)
  },
  {
    field: 'receivedAt',
    headerName: 'Received At',

    valueGetter: ({ value }) => formatDateTime(value, true)
  }
];

export default function DeliveredOrder() {
  const dispatch = useDispatch();
  const listIsLoading = useSelector(orderListIsLoadingSelector);
  const orders = useSelector(orderListSelector);
  const page = useSelector(orderPageSelector);
  const pageSize = useSelector(orderPageSizeSelector);
  const sortModel = useSelector(orderSortSelector);
  const total = useSelector(orderTotalSelector);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false,
    order_number: false,
    chanel: false,
    agent: false,
    total_tax: false,
    total_discounts: false,
    receivedAt: false,
    createdAt: false,
    assignedAt: false,
    courier: false
  });

  useEffect(() => {
    dispatch(setOrderFilters([]));
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllOrder({
        body: { sort: sortModel, page, pageSize, filters: [{ column: 'status', op: 'Text is exactly', value: 'Delivered' }] }
      })
    );
  }, [page, pageSize, sortModel]);

  return (
    <Grid container>
      <Grid item xs={12} mb={2}>
        <Typography variant="h5">Delivered Orders</Typography>
      </Grid>
      <Grid item xs={12} mb={2}>
        <MainCard>
          <DataGrid
            slots={{
              noRowsOverlay: CustomNoRowsOverlay
            }}
            initialState={{
              sorting: {
                sortModel
              }
            }}
            showCellVerticalBorder
            loading={listIsLoading}
            checkboxSelection={false}
            paginationMode="server"
            pageSizeOptions={[10, 25, 50, 100]}
            onPaginationModelChange={(paginationModal) => dispatch(setOrderPagination(paginationModal))}
            paginationModel={{ page, pageSize }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={setColumnVisibilityModel}
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={(sortModel) => dispatch(setOrderSort(sortModel))}
            rowCount={total}
            getRowHeight={() => 'auto'}
            rows={orders || []}
            columns={column}
          />
        </MainCard>
      </Grid>
    </Grid>
  );
}
