import React, { useEffect, useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridRowEditStopReasons,
  GridRowModes
} from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
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
import { Button, Box, Modal } from '@mui/material';
import AssignSelectedOrderModal from './AssignSelectedOrderModal';
import CustomNoRowsOverlay from '../../components/GridNoRowCustomOverlay';
import { setOrder, setOrderFilters, setOrderPagination, setOrderSort } from 'store/slices/order/orderSlice';
import FilterModal from './FilterModal';
import { setMessage } from 'store/slices/util/utilSlice';
import { authPermissionsSelector } from 'store/slices/auth/authSelector';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { formatDateTime } from 'utils/format-date';
import { useGridApiRef } from '../../../node_modules/@mui/x-data-grid/index';
import GridEditTextarea from './GridEditTextarea';
import { GRID_ORDER_STATUSES } from 'constants/orderStatuses';
import { cityCitiesSelector, cityCreateFetchStatusSelector } from 'store/slices/city/citySelector';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllCities } from 'store/slices/city/fetchCity';
import GridSearchSelect from './GridSearchSelect';
const columns = (apiRef, rowModesModel, citiesList, handleViewClick, handleSaveClick, handleCancelClick) => [
  {
    field: 'order_number',
    headerName: 'Order#',
    flex: 0.5
  },
  {
    field: 'first_name',
    headerName: 'Customer',
    flex: 0.5,
    sortable: false,
    editable: false,
    type: 'string',
    valueGetter: (param) => param.row.customer?.first_name || ''
  },
  {
    field: 'phone',
    headerName: 'Customer Ph',
    flex: 0.75,
    sortable: false,
    valueGetter: (param) => param.row.customer?.phone || param.row.address?.phone || ''
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
    field: 'item',
    headerName: 'Items',
    flex: 1,
    sortable: false,
    editable: false,
    valueGetter: (param) => {
      const items = param.row.items;
      if (!items || !items.length) {
        return 'None';
      }
      if (items && items.length === 1) {
        return `${items[0].name}/${items[0].quantity}`;
      }
      return items.reduce((pv, cv) => `${pv}, ${cv.name}/${cv.quantity}`, '');
    },
    type: 'string'
  },
  {
    field: 'addItem',
    headerName: 'Add Item',
    sortable: false,
    flex: 0.2,
    type: 'actions',
    cellClassName: 'actions',
    getActions: (params) => {
      const id = params.id;
      return [
        <GridActionsCellItem
          key={id}
          icon={<AddIcon />}
          label="Add item"
          className="textPrimary"
          onClick={handleCancelClick(id)}
          color="inherit"
        />
      ];
    }
  },
  {
    field: 'total_price',
    headerName: 'Amount',
    flex: 0.33
  },
  {
    field: 'total_discounts',
    headerName: 'Discount',
    flex: 0.33
  },
  //advance payments will be here
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.5,
    editable: true,
    type: 'singleSelect',
    valueOptions: GRID_ORDER_STATUSES
  },
  {
    field: 'remarks',
    headerName: 'Remarks',
    flex: 0.5,
    sortable: false,
    editable: true,
    type: 'string',
    renderEditCell: (params) => <GridEditTextarea {...params} />,
    valueGetter: (param) => param.row.remarks || 'None',
    valueParser: (value) => value.replace(/\n/g, ' ').replace(/\s\s+/g, ' ')
  },
  {
    field: 'total_tax',
    headerName: 'Tax Amount',
    flex: 0.33
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 1,
    valueGetter: ({ value }) => formatDateTime(value, true)
  },
  {
    field: 'receivedAt',
    headerName: 'Received At',
    flex: 1,
    valueGetter: ({ value }) => formatDateTime(value, true)
  },
  {
    field: 'agent',
    headerName: 'Agent',
    flex: 1,
    sortable: false,
    valueGetter: (param) => param.row.user?.name || ''
  },
  {
    field: 'chanel',
    headerName: 'Channel',
    flex: 1,
    sortable: false,
    valueGetter: ({ value }) => (value ? value.name : '')
  },
  {
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    flex: 1,
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
  }
];

const OrderTable = memo(() => {
  const apiRef = useGridApiRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const listIsLoading = useSelector(orderListIsLoadingSelector);
  const orders = useSelector(orderListSelector);
  const page = useSelector(orderPageSelector);
  const pageSize = useSelector(orderPageSizeSelector);
  const filters = useSelector(orderFiltersSelector);
  const sortModel = useSelector(orderSortSelector);
  const total = useSelector(orderTotalSelector);

  const citiesFetchStatus = useSelector(cityCreateFetchStatusSelector);
  const citiesList = useSelector(cityCitiesSelector);
  const userPermissions = useSelector(authPermissionsSelector);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    order_number: false,
    chanel: false,
    agent: false,
    total_tax: false,
    total_discounts: false,
    createdAt: false,
    receivedAt: false
  });

  const [showAssignSelectedModal, setShowAssignSelectedModal] = useState(false);
  const displayShowAssignSelectedModal = () => setShowAssignSelectedModal(true);
  const hideAssignSelectedModal = () => setShowAssignSelectedModal(false);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const displayFilterModal = () => setShowFilterModal(true);
  const hideFilterModal = () => setShowFilterModal(false);

  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [partialUpdateOrderLoading, setPartialUpdateOrderLoading] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [checkboxSelection, setCheckboxSelection] = useState(false);

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

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true }
    });
  };

  const processRowUpdate = async (newRow, preRow) => {
    console.log(newRow, preRow, 'new Row pre Row');
    dispatch(setOrder({ order: { ...newRow, address1: newRow.address1 || newRow?.address?.address1 } }));
    const id = newRow.id;
    const body = {
      status: newRow?.status || '',
      customerId: newRow?.customer?.id || '',
      first_name: newRow?.first_name || '',
      last_name: newRow?.customer?.last_name || '',
      addressId: newRow?.address?.id,
      address: newRow?.address1 || '',
      city: newRow?.city || ''
    };
    setPartialUpdateOrderLoading(true);
    const { type, payload } = await dispatch(fetchPartialUpdateOrder({ id, body }));
    if (type === 'order/partialUpdate/fetch/fulfilled') {
      dispatch(setOrder({ order: payload?.data.order }));
      dispatch(setMessage({ type: 'success', message: payload?.data?.message || 'Success! Order updated!' }));
    } else {
      dispatch(setMessage({ type: 'error', message: payload?.data?.message || 'Failed! Order not updated!' }));
    }
    setPartialUpdateOrderLoading(false);
    return { ...newRow, isNew: false };
  };

  const handleProcessRowUpdateError = (error) => {
    console.log(error, 'new error in handleProcessRowUpdateError');
  };

  const fetchOrders = () => dispatch(fetchAllOrder({ body: { sort: sortModel, page, pageSize, filters } }));

  useEffect(() => {
    if (citiesFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllCities());
    }
    fetchOrders();
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

  const handleApplyFilters = (columnsWithFilter) => {
    const filters = [];
    columnsWithFilter.forEach((column) => {
      if ('filter' in column) {
        filters.push({ column: column.field, op: column.filter.op, value: column.filter.value });
      }
    });
    dispatch(setOrderFilters(filters));
  };

  function renderToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <Button onClick={displayFilterModal} size="small" startIcon={<FilterListIcon />}>
          Filters
        </Button>
        <Button onClick={() => setCheckboxSelection((pv) => !pv)} size="small" startIcon={<IndeterminateCheckBoxIcon />}>
          Toggle Selection
        </Button>
        {rowSelectionModel.length > 0 && (
          <Button onClick={displayShowAssignSelectedModal} size="small" startIcon={<AssignmentIndIcon />}>
            Assign
          </Button>
        )}
        {userPermissions.includes(PERMISSIONS.PERMISSION_BULK_ORDER_DELETE) && rowSelectionModel.length > 0 && (
          <Button disabled={bulkDeleteLoading} onClick={handleBulkDelete} size="small" startIcon={<DeleteSweepIcon />}>
            Delete All
          </Button>
        )}
        {userPermissions.includes(PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS) && <GridToolbarExport />}
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ height: !orders || !orders.length ? 400 : '80vh', width: '100%' }}>
      <DataGrid
        apiRef={apiRef}
        loading={listIsLoading}
        checkboxSelection={checkboxSelection}
        slots={{
          toolbar: renderToolbar,
          noRowsOverlay: CustomNoRowsOverlay
        }}
        // autoHeight={true}
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
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        columns={columns(apiRef, rowModesModel, citiesList, handleViewClick, handleSaveClick, handleCancelClick)}
      />
      <AssignSelectedOrderModal visible={showAssignSelectedModal} onClose={hideAssignSelectedModal} selectedRows={rowSelectionModel} />
      <FilterModal
        visible={showFilterModal}
        onClose={hideFilterModal}
        onApplyFilters={handleApplyFilters}
        columns={columns()
          .slice(0, -1)
          .map(({ field, headerName }) => {
            const filterObj = { field, headerName };
            const filterInState = filters.find((f) => f.column === field);
            if (filterInState) {
              filterObj.filter = filterInState;
            }
            return filterObj;
          })}
      />
    </div>
  );
});

export default OrderTable;
