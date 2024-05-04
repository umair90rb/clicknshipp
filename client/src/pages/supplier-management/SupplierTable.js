import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { fetchAllSupplier, fetchDeleteSupplier } from 'store/slices/supplier/fetchSupplier';
import { supplierIsLoadingSelector, supplierSuppliersSelector } from 'store/slices/supplier/supplierSelector';
import { deleteSupplier } from 'store/slices/supplier/supplierSlice';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
const columns = (handleEditAction, handleDeleteAction) => [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.3
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1.7
  },
  {
    field: 'account_number',
    headerName: 'Account Number',
    flex: 1
  },
  {
    field: 'company',
    headerName: 'Company',
    flex: 1
  },
  {
    field: 'phone',
    headerName: 'Phone',
    flex: 1
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    type: 'actions',
    cellClassName: 'actions',
    getActions: ({ id, row }) => {
      const actions = [];
      if (handleEditAction) {
        actions.push(
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="View"
            className="textPrimary"
            onClick={() => handleEditAction(row)}
            color="inherit"
          />
        );
      }
      if (handleDeleteAction) {
        actions.push(
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Disable"
            className="textPrimary"
            onClick={() => handleDeleteAction(id)}
            color="inherit"
          />
        );
      }

      return actions;
    }
  }
];

export default function SupplierTable({ updateSupplierHandler }) {
  const dispatch = useDispatch();
  const supplierIsLoading = useSelector(supplierIsLoadingSelector);
  const suppliers = useSelector(supplierSuppliersSelector);
  const { hasPermission } = useAccess();

  useEffect(() => {
    dispatch(fetchAllSupplier());
  }, []);

  const handleDelete = (id) => {
    dispatch(fetchDeleteSupplier({ id })).then((action) => {
      if (action.type === 'supplier/delete/fetch/fulfilled') {
        dispatch(deleteSupplier({ id }));
      }
    });
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
        loading={supplierIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={suppliers}
        columns={columns(
          hasPermission(PERMISSIONS.PERMISSION_UPDATE_SUPPLIER) ? updateSupplierHandler : undefined,
          hasPermission(PERMISSIONS.PERMISSION_DELETE_SUPPLIER) ? handleDelete : undefined
        )}
      />
    </div>
  );
}
