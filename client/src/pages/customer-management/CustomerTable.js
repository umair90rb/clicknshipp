import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { fetchAllCustomer } from 'store/slices/customer/fetchCustomer';
import { customerCustomersSelector, customerIsLoadingSelector } from 'store/slices/customer/customerSelector';
const columns = (handleView) => [
  {
    field: 'id',
    headerName: 'ID.',
    flex: 0.3
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1.7
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1
  },
  {
    field: 'phone',
    headerName: 'Phone',
    flex: 1
  },
  {
    field: 'note',
    headerName: 'Note',
    flex: 1
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
  const customerIsLoading = useSelector(customerIsLoadingSelector);
  const customers = useSelector(customerCustomersSelector) || [];

  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, []);

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        loading={customerIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={customers}
        columns={columns(openViewForm)}
      />
    </div>
  );
}
