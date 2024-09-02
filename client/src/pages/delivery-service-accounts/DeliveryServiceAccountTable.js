import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import {
  deliveryServiceAccountsIsLoadingSelector,
  deliveryServiceAccountsListSelector
} from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSelector';
import {
  fetchDeleteDeliveryServiceAccount,
  fetchDeliveryServiceAccounts
} from 'store/slices/deliveryServicesAccounts/fetchDeliveryServicesAccounts';
import { deleteDeliveryServiceAccount } from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSlice';
import { setMessage } from 'store/slices/util/utilSlice';
import { fetchDownloadBookedOrderReceipts } from 'store/slices/order/fetchOrder';
const columns = (handleEditAction, handleDeleteAction, handleDownloadAction) => [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.3
  },
  {
    field: 'name',
    headerName: 'Account Name',
    flex: 1
  },
  {
    field: 'service',
    headerName: 'Type',
    flex: 1,
    valueGetter: ({ value }) => value.toUpperCase()
  },
  {
    field: 'halfKey',
    headerName: 'Key',
    flex: 1
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
    getActions: ({ id, row }) => {
      const actions = [
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
      ];
      if (row.service === 'postex') {
        actions.push(
          <GridActionsCellItem
            key={id}
            icon={<CloudDownloadOutlinedIcon />}
            label="Download Today Airways Bill"
            className="textPrimary"
            onClick={() => handleDownloadAction(id)}
            color="inherit"
          />
        );
      }

      return actions;
    }
  }
];

export default function DeliveryServiceAccountTable({ updateAccountHandler }) {
  const dispatch = useDispatch();
  const accountsIsLoading = useSelector(deliveryServiceAccountsIsLoadingSelector);
  const accounts = useSelector(deliveryServiceAccountsListSelector);

  useEffect(() => {
    dispatch(fetchDeliveryServiceAccounts());
  }, []);

  const handleDownloadAction = async (id) => {
    const { type, payload } = await dispatch(fetchDownloadBookedOrderReceipts({ body: { accountId: id } }));
    if (type === 'order/downloadReceipts/fetch/fulfilled') {
      const blob = new Blob([payload.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Airways Bill.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      dispatch(setMessage({ message: payload?.error?.message || 'File not download!', type: 'error' }));
    }
  };

  const deleteItemHandler = async (id) => {
    const { type, payload } = await dispatch(fetchDeleteDeliveryServiceAccount({ id }));
    if (type === 'account/delete/fetch/fulfilled') {
      dispatch(deleteDeliveryServiceAccount(id));
      dispatch(setMessage({ message: 'Account deleted successfully.', type: 'success' }));
    } else {
      dispatch(setMessage({ message: payload || 'Account not deleted.', type: 'error' }));
    }
  };

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
        columns={columns(updateAccountHandler, deleteItemHandler, handleDownloadAction)}
      />
    </div>
  );
}
