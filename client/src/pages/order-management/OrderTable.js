import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridLogicOperator
} from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import {
  orderListIsLoadingSelector,
  orderListSelector,
  orderPageSelector,
  orderPageSizeSelector,
  orderTotalSelector
} from 'store/slices/order/orderSelector';
import { fetchAllOrder } from 'store/slices/order/fetchOrder';
import location from 'utils/location';
import { formatDateTime } from 'utils/format-date';
import CircularLoader from 'components/CircularLoader';
import { Button, Box, Modal } from '../../../node_modules/@mui/material/index';
import AssignOrderModal from './AssingOrderModal';
import CustomNoRowsOverlay from './NoRowCustomOverlay';
import { setOrderPagination } from 'store/slices/order/orderSlice';
const columns = (viewAction) => [
  {
    field: 'order_number',
    headerName: 'Order#',
    flex: 1
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1
  },
  {
    field: 'agent',
    headerName: 'Agent',
    flex: 1,
    valueGetter: (param) => param.row.user?.name || ''
  },
  {
    field: 'address',
    headerName: 'Address',
    flex: 1,
    resizable: true,
    valueGetter: (param) => param.row.address?.address1 || ''
  },
  {
    field: 'city',
    headerName: 'City',
    flex: 1,
    valueGetter: (param) => param.row.address?.city || ''
  },

  {
    field: 'total_price',
    headerName: 'Total Amount',
    flex: 1
  },
  {
    field: 'total_tax',
    headerName: 'Tax Amount',
    flex: 1
  },
  {
    field: 'total_discounts',
    headerName: 'Discount',
    flex: 1
  },
  {
    field: 'createdAt',
    headerName: 'Received At',
    flex: 1,
    type: 'dateTime',
    valueGetter: ({ value }) => new Date(value)
  },
  {
    field: 'chanel',
    headerName: 'Channel',
    flex: 1,
    valueGetter: ({ value }) => (value ? value.name : '')
  },
  {
    field: 'actions',
    headerName: 'Actions',
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
  const total = useSelector(orderTotalSelector);

  const [filterModel, setFilterModel] = useState({});
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    status: false,
    chanel: false,
    agent: false,
    total_tax: false,
    total_discounts: false
  });

  const [showAssignModal, setShowAssignModal] = useState(false);
  const displayShowAssignModal = () => setShowAssignModal(true);
  const hideAssignModal = () => setShowAssignModal(false);

  useEffect(() => {
    dispatch(fetchAllOrder({ body: { page, pageSize } }));
  }, [page, pageSize]);

  const handleViewOrder = (id) => () => navigate(location.viewOrder(id));

  const onFilterChange = useCallback((newFilterModel) => {
    console.log(newFilterModel);
    setFilterModel(newFilterModel);
  }, []);

  function renderToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        {/* <GridToolbarFilterButton /> */}
        <GridToolbarExport />
        <GridToolbarDensitySelector />
        <Button onClick={displayShowAssignModal} size="small" startIcon={<FilterListIcon />}>
          Filters
        </Button>
        {rowSelectionModel.length > 0 && (
          <Button onClick={displayShowAssignModal} size="small" startIcon={<AssignmentIndIcon />}>
            Assign
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
        rowCount={total}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
        rows={orders || []}
        columns={columns(handleViewOrder)}
        disableColumnResize={false}
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
    </div>
  );
}
