import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { itemIsLoadingSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import { fetchAllItem, fetchDeleteItem } from 'store/slices/item/fetchItem';
import { deleteItem } from 'store/slices/item/itemSlice';
import {
  deliveryServiceAccountsFetchStatusSelector,
  deliveryServiceAccountsIsLoadingSelector,
  deliveryServiceAccountsListSelector
} from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSelector';
import { fetchDeliveryServiceAccounts } from 'store/slices/deliveryServicesAccounts/fetchDeliveryServicesAccounts';
const columns = (handleEditAction, handleDeleteAction) => [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.3
  },
  {
    field: 'service',
    headerName: 'Service Name',
    flex: 1
  },
  {
    field: 'key',
    headerName: 'Key',
    flex: 1,
    valueGetter: () => '***********'
  },
  {
    field: 'active',
    headerName: 'Status',
    valueGetter: ({ value }) => (value ? 'active' : 'inactive'),
    flex: 1
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    type: 'actions',
    cellClassName: 'actions',
    getActions: ({ id, row }) => [
      <GridActionsCellItem
        key={id}
        icon={<EditIcon />}
        label="View"
        className="textPrimary"
        onClick={() => handleEditAction(row)}
        color="inherit"
      />,
      <GridActionsCellItem
        key={id}
        icon={<DeleteIcon />}
        label="Disable"
        className="textPrimary"
        onClick={() => handleDeleteAction(id)}
        color="inherit"
      />
    ]
  }
];

export default function DeliveryServiceAccountTable({ updateAccountHandler }) {
  const dispatch = useDispatch();
  const accountsIsLoading = useSelector(deliveryServiceAccountsIsLoadingSelector);
  const accounts = useSelector(deliveryServiceAccountsListSelector);

  useEffect(() => {
    dispatch(fetchDeliveryServiceAccounts());
  }, []);

  const deleteItemHandler = (id) => {};

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        loading={accountsIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={accounts}
        columns={columns(updateAccountHandler, deleteItemHandler)}
      />
    </div>
  );
}