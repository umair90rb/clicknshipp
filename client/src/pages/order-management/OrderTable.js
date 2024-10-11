import React, { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  GridToolbarExport,
  GridRowEditStopReasons,
  GridRowModes
} from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
// import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import {
  orderFiltersSelector,
  orderListIsLoadingSelector,
  orderListSelector,
  orderPageSelector,
  orderPageSizeSelector,
  orderSortSelector,
  orderTotalSelector
} from 'store/slices/order/orderSelector';
import { fetchAllOrder, fetchBulkOrdersDelete, fetchPartialUpdateOrder } from 'store/slices/order/fetchOrder';
import location from 'utils/location';
import { Button, Box, Chip } from '@mui/material';
import AssignSelectedOrderModal from './AssignSelectedOrderModal';
import CustomNoRowsOverlay from '../../components/GridNoRowCustomOverlay';
import { setOrder, setOrderFilters, setOrderPagination, setOrderSort } from 'store/slices/order/orderSlice';
// import FilterModal from './FilterModal';
import { setMessage } from 'store/slices/util/utilSlice';
import { authPermissionsSelector } from 'store/slices/auth/authSelector';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { formatDateTime, getEndOfDay, getStartOfDay } from 'utils/format-date';
import { useGridApiRef } from '../../../node_modules/@mui/x-data-grid/index';
import GridEditTextarea from './GridEditTextarea';
import ORDER_STATUSES, { ORDER_TAGS } from 'constants/orderStatuses';
import { cityCitiesSelector, cityFetchStatusSelector } from 'store/slices/city/citySelector';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllCities } from 'store/slices/city/fetchCity';
import GridSearchSelect from './GridSearchSelect';
import GridAddItemModal from './GridAddItemModal/index';
import { GridDropdownFilter } from './GridDropdownFilter';
import { fetchDeliveryServiceAccounts } from 'store/slices/deliveryServicesAccounts/fetchDeliveryServicesAccounts';
import {
  deliveryServiceAccountsFetchStatusSelector,
  deliveryServiceAccountsListSelector
} from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSelector';
import useAccess from 'hooks/useAccess';
import PaymentsModal from './PaymentsModal';
import { chanelFetchStatusSelector } from 'store/slices/chanel/chanelSelector';
import { fetchAllChanel } from 'store/slices/chanel/fetchChanel';
import { GridDateFilter } from './GridDateFilter';
const columns = (
  apiRef,
  rowModesModel,
  couriersList,
  handleViewClick,
  handleSaveClick,
  handleCancelClick,
  handleAddItemClick,
  handleAddPaymentClick
) => [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.25
  },
  {
    field: 'order_number',
    headerName: 'Order#',
    flex: 0.5
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    sortable: false,
    editable: true,
    type: 'string',
    valueGetter: (param) => `${param.row.customer?.first_name || ''} ${param.row.customer?.last_name || ''}`
  },
  {
    field: 'address1',
    headerName: 'Address',
    flex: 1,
    sortable: false,
    editable: true,
    type: 'string',
    renderEditCell: (params) => <GridEditTextarea {...params} />,
    valueGetter: (param) => param.row.address?.address1 || '',
    valueParser: (value) => value.replace(/\n/g, ' ').replace(/\s\s+/g, ' ')
  },
  {
    field: 'city',
    headerName: 'City',
    flex: 1,
    sortable: false,
    editable: true,
    type: 'string',
    valueGetter: (param) => param.row.address?.city || '',
    renderEditCell: (params) => <GridSearchSelect {...params} />
  },
  {
    field: 'phone',
    headerName: 'Phone',
    flex: 1,
    sortable: false,
    editable: true,
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
    },
    renderCell: (params) => {
      const items = params.row.items;
      let itemsStr = 'None';
      if (items && items.length === 1) {
        itemsStr = `${items[0].name}/${items[0].quantity}`;
      }
      if (items && items.length > 1) {
        itemsStr = items.reduce((pv, cv) => `${cv.name}/${cv.quantity}, ${pv}`, '');
      }
      return (
        <div>
          <span style={{ fontSize: 18 }}>{itemsStr}</span>
          <GridActionsCellItem
            key={params.id}
            icon={<EditIcon />}
            label="Update item"
            className="textPrimary"
            onClick={handleAddItemClick(params.id, items)}
            color="inherit"
          />
        </div>
      );
    }
  },
  {
    field: 'total_price',
    headerName: 'Amount',
    flex: 0.33
  },
  {
    field: 'payments',
    headerName: 'Payments',
    flex: 1,
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
    },
    renderCell: (params) => {
      const payments = params.row.payments;
      let paymentsStr = '';
      if (payments && payments.length > 0) {
        paymentsStr = payments.reduce(
          (pv, cv) => `${cv.label || ''} Rs.${cv.amount} TID:${cv.tid} ${cv.note || ''} ${pv ? ',' + pv : ''}`,
          ''
        );
      }
      return (
        <div>
          <span style={{ fontSize: 18 }}>{paymentsStr}</span>
          <GridActionsCellItem
            key={params.id}
            icon={<AddIcon />}
            label="Update payment"
            className="textPrimary"
            onClick={handleAddPaymentClick(params.id)}
            color="inherit"
          />
        </div>
      );
    }
  },
  {
    field: 'total_discounts',
    headerName: 'Discount',
    flex: 0.33
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.5,
    editable: true,
    type: 'singleSelect',
    valueOptions: ORDER_STATUSES
  },
  {
    field: 'courier',
    headerName: 'Courier',
    flex: 0.5,
    editable: true,
    type: 'singleSelect',
    valueOptions: couriersList
  },
  {
    field: 'remarks',
    headerName: 'Remarks',
    flex: 0.5,
    sortable: false,
    editable: true,
    type: 'string',
    renderEditCell: (params) => <GridEditTextarea {...params} />,
    valueGetter: (param) => param.row.remarks || '',
    valueParser: (value) => value.replace(/\n/g, ' ').replace(/\s\s+/g, ' ')
  },
  {
    field: 'tags',
    headerName: 'Tags',
    flex: 0.5,
    sortable: false,
    renderCell: (params) => (
      <Box>
        {(params.row.tags || '').split(',').map((tag, index) => tag && <Chip key={index} label={tag} size="small" variant="outlined" />)}
      </Box>
    )
  },

  {
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    flex: 0.5,
    type: 'actions',
    cellClassName: 'actions',
    getActions: (params) => {
      const id = params.id;
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            key={id}
            icon={<SaveIcon />}
            label="Save"
            className="textPrimary"
            onClick={handleSaveClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={id}
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={handleCancelClick(id)}
            color="inherit"
          />
        ];
      }

      return [
        <GridActionsCellItem
          key={id}
          icon={<VisibilityIcon />}
          label="View"
          className="textPrimary"
          onClick={handleViewClick(id)}
          color="inherit"
        />,

        <GridActionsCellItem
          key={id}
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          onClick={() => apiRef.current.startRowEditMode({ id })}
          color="inherit"
        />
      ];
    }
  },
  {
    field: 'chanel',
    headerName: 'Channel',
    flex: 1,
    sortable: false,
    valueGetter: ({ value }) => (value ? value.name : '')
  },
  {
    field: 'agent',
    headerName: 'Agent',
    flex: 0.5,
    sortable: false,
    valueGetter: (param) => param.row.user?.name || ''
  },
  {
    field: 'total_tax',
    headerName: 'Tax Amount',
    flex: 0.33
  },
  {
    field: 'delivery',
    headerName: 'Delivery',
    flex: 1,
    sortable: false,
    valueGetter: ({ value }) => `${value?.tracking_status || ''} ${value?.cn || ''} `
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 0.5,
    valueGetter: ({ value }) => formatDateTime(value, true)
  },
  {
    field: 'assignedAt',
    headerName: 'Assigned At',
    flex: 0.5,
    valueGetter: ({ value }) => formatDateTime(value, true)
  },
  {
    field: 'receivedAt',
    headerName: 'Received At',
    flex: 0.5,
    valueGetter: ({ value }) => formatDateTime(value, true)
  }
];

const OrderTable = memo(() => {
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hasPermission } = useAccess();
  const listIsLoading = useSelector(orderListIsLoadingSelector);
  const orders = useSelector(orderListSelector);
  const page = useSelector(orderPageSelector);
  const pageSize = useSelector(orderPageSizeSelector);
  const filters = useSelector(orderFiltersSelector);
  const sortModel = useSelector(orderSortSelector);
  const total = useSelector(orderTotalSelector);
  // const orderChanelFilter = useSelector(orderChanelFiltersSelector);

  const citiesList = useSelector(cityCitiesSelector);
  const citiesFetchStatus = useSelector(cityFetchStatusSelector);
  const deliveryServiceAccountsList = useSelector(deliveryServiceAccountsListSelector);
  const deliveryServiceAccountsFetchStatus = useSelector(deliveryServiceAccountsFetchStatusSelector);
  // const chanel = useSelector(chanelChanelsSelector);
  const chanelFetchStatus = useSelector(chanelFetchStatusSelector);
  const userPermissions = useSelector(authPermissionsSelector);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false,
    order_number: false,
    chanel: false,
    agent: false,
    total_tax: false,
    total_discounts: false,
    receivedAt: false,
    createdAt: false,
    assignedAt: false
  });

  const [showAssignSelectedModal, setShowAssignSelectedModal] = useState(false);
  const displayShowAssignSelectedModal = () => setShowAssignSelectedModal(true);
  const hideAssignSelectedModal = () => setShowAssignSelectedModal(false);

  // const [showFilterModal, setShowFilterModal] = useState(false);
  // const displayFilterModal = () => setShowFilterModal(true);
  // const hideFilterModal = () => setShowFilterModal(false);

  const [addItemInOrderVisible, setAddItemInOrderVisible] = useState(false);
  const [addItemInOrderOrderId, setAddItemInOrderOrderId] = useState(null);
  const [addItemInOrderItems, setAddItemInOrderItems] = useState([]);
  const handleAddItemClick = (orderId, items) => () => {
    setAddItemInOrderOrderId(orderId);
    setAddItemInOrderItems(items);
    setAddItemInOrderVisible(true);
  };
  const hideAddItemInOrderVisible = () => {
    setAddItemInOrderOrderId(null);
    setAddItemInOrderItems([]);
    setAddItemInOrderVisible(false);
  };

  const [addPaymentVisible, setAddPaymentVisible] = useState(false);
  const [addPaymentOrderId, setAddPaymentOrderId] = useState(null);

  const handleAddPaymentClick = (orderId) => () => {
    setAddPaymentOrderId(orderId);
    setAddPaymentVisible(true);
  };
  const hideAddPaymentVisible = () => {
    setAddPaymentOrderId(null);
    setAddPaymentVisible(false);
  };

  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [partialUpdateOrderLoading, setPartialUpdateOrderLoading] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
    if (params.reason === GridRowEditStopReasons.enterKeyDown) {
      event.defaultMuiPrevented = true;
    }
    if (event.key === 'Enter' && event.ctrlKey) {
      event.defaultMuiPrevented = false;
    }
  };

  // const handleRowEditStart = (params, event) => {
  //   if (params?.row?.status === 'Confirmed') {
  //     dispatch(setMessage({ type: 'warning', message: 'Confirmed order can not updated!' }));
  //     event.defaultMuiPrevented = true;
  //     return;
  //   }
  // };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });
  };

  const processRowUpdate = async (newRow, oldRow) => {
    // dispatch(setOrder({ order: { ...newRow, address1: newRow.address1 || newRow?.address?.address1 } }));
    const id = newRow.id;
    const [first, second, ...rest] = newRow.name.split(' ');
    console.log(rest);
    const body = {
      status: newRow?.status,
      customerId: newRow?.customer?.id,
      first_name: `${first}${second ? ' ' + second : ''}`,
      last_name: `${rest.join(' ') || ''}`,
      delivery_account_id: newRow?.courier,
      phone: newRow?.phone,
      remarks: newRow?.remarks,
      addressId: newRow?.address?.id,
      address: newRow?.address1,
      city: newRow?.city
    };
    setPartialUpdateOrderLoading(true);
    const { type, payload } = await dispatch(fetchPartialUpdateOrder({ id, body }));
    if (type === 'order/partialUpdate/fetch/fulfilled') {
      dispatch(setOrder({ order: payload?.data.order }));
      dispatch(setMessage({ type: 'success', message: payload?.data?.message || 'Success! Order updated!' }));
      setPartialUpdateOrderLoading(false);
      return payload?.data.order;
    } else {
      dispatch(setMessage({ type: 'error', message: payload?.error?.join(',') || 'Failed! Order not updated!' }));
      setPartialUpdateOrderLoading(false);
      return oldRow;
    }
  };

  const handleProcessRowUpdateError = (error) => {
    console.log(error, 'new error in handleProcessRowUpdateError');
    dispatch(setMessage({ type: 'error', message: 'Failed! Order not updated!' }));
    return;
  };

  useEffect(() => {
    if (citiesFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllCities());
    }
    if (deliveryServiceAccountsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchDeliveryServiceAccounts());
    }
    if (chanelFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllChanel());
    }
  }, []);

  const fetchOrders = (filters) => {
    // let _filters = filters.filter((f) => f.column !== 'chanel_id');
    // let chanelFilter = filters.find((f) => f.column === 'chanel_id');
    // if (chanelFilter) {
    //   chanelFilter = { ...chanelFilter, value: chanelFilter.value.map((c) => c.id) };
    // }
    dispatch(fetchAllOrder({ body: { sort: sortModel, page, pageSize, filters } }));
  };

  useEffect(() => {
    fetchOrders(filters);
  }, [page, pageSize, filters, sortModel]);

  const handleViewClick = (id) => () => navigate(location.viewOrder(id));

  const handleBulkDelete = async () => {
    setBulkDeleteLoading(true);
    const { type, payload } = await dispatch(fetchBulkOrdersDelete({ body: { orderIds: rowSelectionModel } }));
    if (type === 'order/bulk/delete/fetch/fulfilled') {
      dispatch(setMessage({ type: 'success', message: payload?.data?.message || 'Orders deleted successfully!' }));
      fetchOrders();
    } else {
      dispatch(setMessage({ type: 'error', message: payload?.data?.message || 'Orders not deleted!' }));
    }
    setBulkDeleteLoading(false);
  };

  // const handleApplyFilters = (columnsWithFilter) => {
  //   const filters = [];
  //   columnsWithFilter.forEach((column) => {
  //     if ('filter' in column) {
  //       filters.push({ column: column.field, op: column.filter.op, value: column.filter.value });
  //     }
  //   });
  //   dispatch(setOrderFilters(filters));
  // };

  const handleClearFilters = () => dispatch(setOrderFilters([]));

  function renderToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        {/* <GridToolbarDensitySelector /> */}
        {/* <Button
          onClick={displayFilterModal}
          size="small"
          startIcon={
            <Badge badgeContent={filters.length || 0} color="primary">
              <FilterListIcon />
            </Badge>
          }
        >
          Filters
        </Button> */}
        {userPermissions.includes(PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS) && <GridToolbarExport />}

        {filters.length > 0 && (
          <Button onClick={handleClearFilters} size="small" startIcon={<FilterListOffIcon />}>
            Clear Filters
          </Button>
        )}

        {userPermissions.includes(PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS) && rowSelectionModel.length > 0 && (
          <Button onClick={displayShowAssignSelectedModal} size="small" startIcon={<AssignmentIndIcon />}>
            Assign
          </Button>
        )}
        {userPermissions.includes(PERMISSIONS.PERMISSION_BULK_ORDER_DELETE) && rowSelectionModel.length > 0 && (
          <Button disabled={bulkDeleteLoading} onClick={handleBulkDelete} size="small" startIcon={<DeleteSweepIcon />}>
            Delete All
          </Button>
        )}

        <GridDateFilter
          label="Start By"
          value={filters.find((f) => f.column === 'assignedAt' && f.op === 'Date is after')?.value}
          onChange={(date) =>
            dispatch(
              setOrderFilters([
                ...filters.filter((f) => f.column !== 'assignedAt' && f.op !== 'Date is after'),
                {
                  column: 'assignedAt',
                  op: 'Date is after',
                  value: getStartOfDay(date)
                }
              ])
            )
          }
        />
        <GridDateFilter
          label="End By"
          value={filters.find((f) => f.column === 'assignedAt' && f.op === 'Date is before')?.value}
          onChange={(date) =>
            dispatch(
              setOrderFilters([
                ...filters.filter((f) => f.column !== 'assignedAt' && f.op !== 'Date is before'),
                {
                  column: 'assignedAt',
                  op: 'Date is before',
                  value: getEndOfDay(date)
                }
              ])
            )
          }
        />
        <GridDropdownFilter
          multiple
          label="filter by status"
          options={[...ORDER_STATUSES, 'Booked', 'Booking Error']}
          value={filters.find((filter) => filter.column === 'status' && filter.op !== 'Text not in')?.value || []}
          onChange={(e) => {
            if (e.target.value.length === 0) {
              dispatch(setOrderFilters([...filters.filter((filter) => filter.column !== 'status')]));
              return;
            }
            dispatch(
              setOrderFilters([
                ...filters.filter((filter) => filter.column !== 'status'),
                { column: 'status', op: 'Text is any', value: e.target.value }
              ])
            );
          }}
        />
        {/* <GridDropdownFilter
          multiple
          label="filter by chanel"
          options={chanel?.map((c) => ({ id: c.id, label: c.name, value: c.id }))}
          value={filters?.find((filter) => filter.column === 'chanel_id')?.value || []}
          onChange={(e) => {
            if (e.target.value.length === 0) {
              dispatch(setOrderFilters([...filters.filter((filter) => filter.column !== 'chanel_id')]));
              return;
            }
            dispatch(
              setOrderFilters([
                ...filters.filter((filter) => filter.column !== 'chanel_id'),
                { column: 'chanel_id', op: 'Text is any', value: e.target.value }
              ])
            );
          }}
        /> */}
        <GridDropdownFilter
          label="filter by tags"
          options={ORDER_TAGS}
          value={filters.find((filter) => filter.column === 'tags')?.value || ''}
          onChange={(e) => {
            if (!e.target.value || e.target.value === 'All') {
              dispatch(setOrderFilters([...filters.filter((filter) => filter.column !== 'tags')]));
              return;
            }
            dispatch(
              setOrderFilters([
                ...filters.filter((filter) => filter.column !== 'tags'),
                { column: 'tags', op: 'Text contains', value: e.target.value }
              ])
            );
          }}
        />

        {/* <GridSearchSelect /> */}
        <GridDropdownFilter
          multiple
          label="filter by cities"
          options={citiesList}
          value={filters.find((filter) => filter.column === 'city')?.value || []}
          onChange={(e) => {
            if (!e.target.value || e.target.value === 'All') {
              dispatch(setOrderFilters([...filters.filter((filter) => filter.column !== 'city')]));
              return;
            }
            dispatch(
              setOrderFilters([
                ...filters.filter((filter) => filter.column !== 'city'),
                { column: 'city', op: 'Text is any', value: e.target.value }
              ])
            );
          }}
        />

        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <DataGrid
        apiRef={apiRef}
        sx={{
          '& .MuiDataGrid-cellContent': {
            fontSize: 18
          },
          '& .MuiDataGrid-cell': {
            borderColor: 'black'
          }
        }}
        slots={{
          toolbar: renderToolbar,
          noRowsOverlay: CustomNoRowsOverlay
        }}
        initialState={{
          sorting: {
            sortModel
          }
        }}
        disableRowSelectionOnClick
        showCellVerticalBorder
        loading={listIsLoading}
        checkboxSelection={hasPermission(PERMISSIONS.PERMISSION_CREATE_BULK_ORDER)}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
        paginationMode="server"
        pageSizeOptions={[10, 25, 50, 100]}
        onPaginationModelChange={(paginationModal) => dispatch(setOrderPagination(paginationModal))}
        paginationModel={{ page, pageSize }}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(sortModel) => dispatch(setOrderSort(sortModel))}
        rowCount={total}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
        getRowHeight={() => 'auto'}
        rows={orders || []}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        // onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        columns={columns(
          apiRef,
          rowModesModel,
          deliveryServiceAccountsList.map((s) => ({ value: s.id, label: s.name })),
          handleViewClick,
          handleSaveClick,
          handleCancelClick,
          handleAddItemClick,
          handleAddPaymentClick
        )}
      />
      <GridAddItemModal
        orderId={addItemInOrderOrderId}
        items={addItemInOrderItems}
        visible={addItemInOrderVisible}
        onClose={hideAddItemInOrderVisible}
      />
      <AssignSelectedOrderModal visible={showAssignSelectedModal} onClose={hideAssignSelectedModal} selectedRows={rowSelectionModel} />
      <PaymentsModal visible={addPaymentVisible} onClose={hideAddPaymentVisible} orderId={addPaymentOrderId} />
      {/* <FilterModal
        visible={showFilterModal}
        onClose={hideFilterModal}
        onApplyFilters={handleApplyFilters}
        columns={columns()
          .slice(0, -1)
          .reduce((pv, cv) => {
            const { field, headerName } = cv;
            if (field !== 'agent') {
              const filterObj = { field, headerName };
              const filterInState = filters.find((f) => f.column === field);
              if (filterInState) {
                filterObj.filter = filterInState;
              }
              return [...pv, filterObj];
            } else {
              return pv;
            }
          }, [])}
      /> */}
    </div>
  );
});

export default OrderTable;
