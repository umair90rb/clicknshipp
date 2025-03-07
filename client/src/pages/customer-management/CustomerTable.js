import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { fetchAllCustomer } from 'store/slices/customer/fetchCustomer';
import {
  customerCustomersSelector,
  customerIsLoadingSelector,
  customerPageSelector,
  customerPageSizeSelector,
  customerSortSelector,
  customerTotalSelector
} from 'store/slices/customer/customerSelector';
import { useSearchParams } from 'react-router-dom';
import { setCustomerPagination, setCustomerSort } from 'store/slices/customer/customerSlice';
import GridCustomToolbar from 'components/GridCustomToolbar';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const columns = (handleView) => [
  {
    field: 'id',
    headerName: 'ID.',
    flex: 0.25,
    type: 'number'
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    sortable: false
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    sortable: false
  },
  {
    field: 'phone',
    headerName: 'Phone',
    flex: 0.75,
    sortable: false
  },
  {
    field: 'totalOrders',
    headerName: 'Total Orders',
    flex: 0.5,
    sortable: false
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 0.5,
    type: 'actions',
    cellClassName: 'actions',
    getActions: ({ id }) => [
      <GridActionsCellItem
        key={id}
        icon={<VisibilityIcon />}
        label="Disable"
        className="textPrimary"
        onClick={() => handleView(id)}
        color="inherit"
      />
    ]
  }
];

export default function CustomerTable({ openViewForm }) {
  const dispatch = useDispatch();
  const { hasPermission } = useAccess();
  const customerIsLoading = useSelector(customerIsLoadingSelector);
  const customers = useSelector(customerCustomersSelector) || [];
  const page = useSelector(customerPageSelector);
  const pageSize = useSelector(customerPageSizeSelector);
  // const filters = useSelector(orderFiltersSelector);
  const sortModel = useSelector(customerSortSelector);
  const total = useSelector(customerTotalSelector);
  const customerExportPermission = useMemo(() => hasPermission(PERMISSIONS.PERMISSION_EXPORT_CUSTOMER), []);

  const [searchParams] = useSearchParams();
  const searchCustomerId = searchParams.get('id');
  const filterModel = searchCustomerId ? [{ field: 'id', operator: '=', value: searchCustomerId }] : [];

  const fetchCustomer = useCallback(
    () => dispatch(fetchAllCustomer({ body: { sort: sortModel, page, pageSize } })),
    [page, pageSize, sortModel]
  );

  useEffect(() => {
    fetchCustomer();
  }, [page, pageSize, sortModel]);

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        initialState={{
          filter: {
            filterModel: {
              items: filterModel
            }
          }
        }}
        slots={{ toolbar: GridCustomToolbar }}
        slotProps={{
          toolbar: {
            withRefresh: fetchCustomer,
            allowExport: customerExportPermission,
            showQuickFilter: true
          }
        }}
        loading={customerIsLoading}
        rows={customers}
        columns={columns(openViewForm)}
        pageSizeOptions={[25, 50, 75, 100]}
        rowCount={total}
        paginationMode="server"
        onPaginationModelChange={(paginationModal) => dispatch(setCustomerPagination(paginationModal))}
        paginationModel={{ page, pageSize }}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(sortModel) => dispatch(setCustomerSort(sortModel))}
      />
    </div>
  );
}
