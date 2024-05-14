import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  GridToolbarDensitySelector,
  GridToolbarExport
} from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import {
  orderFiltersSelector,
  orderListIsLoadingSelector,
  orderListSelector,
  orderPageSelector,
  orderPageSizeSelector,
  orderSortSelector,
  orderTotalSelector
} from 'store/slices/order/orderSelector';
import { fetchAllOrder, fetchBulkOrdersDelete } from 'store/slices/order/fetchOrder';
import location from 'utils/location';
import { Button, Box, Modal } from '@mui/material';
import AssignOrderModal from './AssignOrderModal';
import CustomNoRowsOverlay from './NoRowCustomOverlay';
import { setOrderFilters, setOrderPagination, setOrderSort } from 'store/slices/order/orderSlice';
import FilterModal from './FilterModal';
import { setMessage } from 'store/slices/util/utilSlice';
import { authPermissionsSelector } from 'store/slices/auth/authSelector';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { formatDateTime } from 'utils/format-date';
const columns = (viewAction) => [
  {
    field: 'order_number',
    headerName: 'Order#',
    flex: 0.75
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1
  },
  {
    field: 'customer',
    headerName: 'Customer',
    flex: 1.25,
    sortable: false,
    valueGetter: (param) => `${param.row.customer?.first_name || ''} ${param.row.customer?.last_name || ''}`
  },
  {
    field: 'phone',
    headerName: 'Customer Ph',
    flex: 1.25,
    sortable: false,
    valueGetter: (param) => param.row.customer?.phone || param.row.address?.phone || ''
  },
  {
    field: 'agent',
    headerName: 'Agent',
    flex: 1,
    sortable: false,
    valueGetter: (param) => param.row.user?.name || ''
  },
  {
    field: 'address',
    headerName: 'Address',
    flex: 2,
    resizable: true,
    sortable: false,
    valueGetter: (param) => param.row.address?.address1 || ''
  },
  {
    field: 'city',
    headerName: 'City',
    flex: 1,
    sortable: false,
    valueGetter: (param) => param.row.address?.city || ''
  },

  {
    field: 'total_price',
    headerName: 'Total Amount',
    flex: 0.33
  },
  {
    field: 'total_tax',
    headerName: 'Tax Amount',
    flex: 0.33
  },
  {
    field: 'total_discounts',
    headerName: 'Discount',
    flex: 0.33
  },
  {
    field: 'createdAt',
    headerName: 'Received At',
    flex: 1,
    valueGetter: ({ value }) => formatDateTime(value, true)
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export default function OrderTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const listIsLoading = useSelector(orderListIsLoadingSelector);
  const orders = useSelector(orderListSelector);
  const page = useSelector(orderPageSelector);
  const pageSize = useSelector(orderPageSizeSelector);
  const filters = useSelector(orderFiltersSelector);
  const sortModel = useSelector(orderSortSelector);
  const total = useSelector(orderTotalSelector);
  const userPermissions = useSelector(authPermissionsSelector);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    chanel: false,
    agent: false,
    total_tax: false,
    total_discounts: false
  });

  const [showAssignModal, setShowAssignModal] = useState(false);
  const displayShowAssignModal = () => setShowAssignModal(true);
  const hideAssignModal = () => setShowAssignModal(false);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const displayFilterModal = () => setShowFilterModal(true);
  const hideFilterModal = () => setShowFilterModal(false);

  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(
      fetchAllOrder({ body: { sort: sortModel, page: filters.length ? 0 : page, pageSize: filters.length ? 100 : pageSize, filters } })
    );
  }, [page, pageSize, filters, sortModel]);

  const handleViewOrder = (id) => () => navigate(location.viewOrder(id));

  const handleBulkDelete = async () => {
    setBulkDeleteLoading(true);
    const { type, payload } = await dispatch(fetchBulkOrdersDelete({ body: { orderIds: rowSelectionModel } }));
    if (type === 'order/bulk/delete/fetch/fulfilled') {
      dispatch(setMessage({ type: 'success', message: payload?.data?.message || 'Orders deleted successfully!' }));
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
        {/* <GridToolbarFilterButton /> */}
        <GridToolbarExport />
        <GridToolbarDensitySelector />
        <Button onClick={displayFilterModal} size="small" startIcon={<FilterListIcon />}>
          Filters
        </Button>
        {rowSelectionModel.length > 0 && (
          <Button onClick={displayShowAssignModal} size="small" startIcon={<AssignmentIndIcon />}>
            Assign
          </Button>
        )}
        {userPermissions.includes(PERMISSIONS.PERMISSION_BULK_ORDER_DELETE) && rowSelectionModel.length > 0 && (
          <Button disabled={bulkDeleteLoading} onClick={handleBulkDelete} size="small" startIcon={<DeleteSweepIcon />}>
            Delete All
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ height: !orders || !orders.length ? 400 : undefined, width: '100%' }}>
      <DataGrid
        loading={listIsLoading}
        checkboxSelection
        slots={{
          toolbar: renderToolbar,
          noRowsOverlay: CustomNoRowsOverlay
        }}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
        paginationMode="server"
        pageSizeOptions={[10, 25, 50, 75, 100]}
        onPaginationModelChange={(paginationModal) => dispatch(setOrderPagination(paginationModal))}
        paginationModel={{ page, pageSize }}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(sortModel) => dispatch(setOrderSort(sortModel))}
        rowCount={total}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
        rows={orders || []}
        columns={columns(handleViewOrder)}
      />
      <Modal
        open={showAssignModal}
        onClose={hideAssignModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AssignOrderModal hideModal={hideAssignModal} selectedRows={rowSelectionModel} />
        </Box>
      </Modal>
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
}
