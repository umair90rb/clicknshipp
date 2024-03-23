import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar, GridActionsCellItem, GridLogicOperator } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { orderListIsLoadingSelector, orderListSelector } from 'store/slices/order/orderSelector';
import { fetchAllOrder } from 'store/slices/order/fetchOrder';
import location from 'utils/location';
import { formatDateTime } from 'utils/format-date';
import CircularLoader from 'components/CircularLoader';
const columns = (viewAction) => [
  {
    field: 'id',
    headerName: 'ID.',
    width: 100
  },
  {
    field: 'order_number',
    headerName: 'Order#',
    width: 100
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100
  },
  {
    field: 'agent',
    headerName: 'Agent',
    width: 100,
    valueGetter: (param) => param.row.user?.name || ''
  },
  {
    field: 'address',
    headerName: 'Address',
    width: 300,
    valueGetter: (param) => param.row.address?.address1 || ''
  },
  {
    field: 'city',
    headerName: 'City',
    width: 100,
    valueGetter: (param) => param.row.address?.city || ''
  },

  {
    field: 'total_price',
    headerName: 'Total Amount',
    width: 100
  },
  {
    field: 'total_tax',
    headerName: 'Tax Amount',
    width: 100
  },
  {
    field: 'total_discounts',
    headerName: 'Discount',
    width: 100
  },
  {
    field: 'createdAt',
    headerName: 'Received At',
    width: 250,
    valueGetter: (params) => formatDateTime(params.row.createdAt)
  },
  {
    field: 'chanel',
    headerName: 'Channel',
    width: 100
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 100,
    type: 'actions',
    cellClassName: 'actions',
    getActions: ({ id }) => [
      <GridActionsCellItem
        key={id}
        icon={<VisibilityIcon />}
        label="View"
        className="textPrimary"
        onClick={viewAction(id)}
        color="inherit"
      />
    ]
  }
];

export default function OrderTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const listIsLoading = useSelector(orderListIsLoadingSelector);

  // const [filterModel, setFilterModel] = React.useState({
  //   linkOperator: 'Or',
  //   items: [
  //     {
  //       field: 'order_number',
  //       id: 31996,
  //       operator: 'contains',
  //       value: '75'
  //     },
  //     {
  //       field: 'status',
  //       id: 31926,
  //       operator: 'contains',
  //       value: 'Booked'
  //     }
  //   ]
  // });

  // const orderImportIsLoading = useSelector(orderImportIsLoadingSelector);
  const orders = useSelector(orderListSelector);

  useEffect(() => {
    dispatch(fetchAllOrder({ body: {} }));
  }, []);

  const handleViewOrder = (id) => () => navigate(location.viewOrder(id));

  // const onFilterChange = useCallback((newFilterModel) => {
  //   console.log(newFilterModel);
  //   setFilterModel(newFilterModel);
  // }, []);

  // console.log(tableRef);

  if (listIsLoading) {
    return <CircularLoader />;
  }
  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <DataGrid
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        pageSizeOptions={[25, 50, 75, 100]}
        onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
        rowSelectionModel={rowSelectionModel}
        // filterModel={filterModel}
        // onFilterModelChange={onFilterChange}
        rows={orders || []}
        columns={columns(handleViewOrder)}
      />
    </div>
  );
}
