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
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { orderListIsLoadingSelector, orderListSelector } from 'store/slices/order/orderSelector';
import { fetchAllOrder } from 'store/slices/order/fetchOrder';
import location from 'utils/location';
import { formatDateTime } from 'utils/format-date';
import CircularLoader from 'components/CircularLoader';
import { Button, Box, Modal } from '../../../node_modules/@mui/material/index';
import AssignOrderModal from './AssingOrderModal';
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
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const listIsLoading = useSelector(orderListIsLoadingSelector);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const displayShowAssignModal = () => setShowAssignModal(true);
  const hideAssignModal = () => setShowAssignModal(false);

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

  console.log(rowSelectionModel, 'rowSelectionModel');

  function renderToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
        <GridToolbarDensitySelector />
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
    <div style={{ width: '100%' }}>
      <DataGrid
        loading={listIsLoading}
        checkboxSelection
        slots={{
          toolbar: renderToolbar
        }}
        pageSizeOptions={[25, 50, 75, 100]}
        onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
        rowSelectionModel={rowSelectionModel}
        // filterModel={filterModel}
        // onFilterModelChange={onFilterChange}
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
    </div>
  );
}
