import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userIsLoadingSelector, userUsersSelector } from 'store/slices/user/userSelector';
import { fetchAllUser } from 'store/slices/user/fetchUser';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { authUserSelector } from 'store/slices/auth/authSelector';
import { setMessage } from 'store/slices/util/utilSlice';
import { setUserForUpdate, disableUser } from 'store/slices/user/userSlice';
import { userService } from 'api/index';

const columns = (handleEditAction, handleDeleteAction) => [
  {
    field: 'id',
    headerName: 'ID.',
    flex: 0.25
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1
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
    field: 'status',
    headerName: 'Status',
    flex: 0.5
  },
  {
    field: 'brands',
    headerName: 'Associated Brands',
    flex: 1,
    valueGetter: ({ value }) => value.map((brand) => brand.name)
  },
  {
    field: 'roles',
    headerName: 'Roles',
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
        onClick={() => handleEditAction(row, null)}
        color="inherit"
      />,
      <GridActionsCellItem
        key={id}
        icon={<NoAccountsIcon />}
        label="Disable"
        className="textPrimary"
        onClick={() => handleDeleteAction(id)}
        color="inherit"
      />
    ]
  }
];

export default function UserTable({ openUpateForm }) {
  const dispatch = useDispatch();
  const userIsLoading = useSelector(userIsLoadingSelector);
  const users = useSelector(userUsersSelector);
  const user = useSelector(authUserSelector);

  useEffect(() => {
    dispatch(fetchAllUser());
  }, []);

  const handleDisableUser = async (id) => {
    if (id === user.id) {
      dispatch(setMessage({ message: "You can't disabled yourself!", type: 'error' }));
      return;
    }
    try {
      await userService.fetchUpdateUser(id, { status: 'inactive' });
      dispatch(setMessage({ message: 'User disabled!', type: 'success' }));
      dispatch(disableUser(id));
    } catch (error) {
      dispatch(setMessage({ message: 'User not disabled!', type: 'error' }));
    }
  };

  const handleUpdate = (data, index) => {
    dispatch(setUserForUpdate({ data, index }));
    openUpateForm(true);
  };

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        loading={userIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={users}
        columns={columns(handleUpdate, handleDisableUser)}
      />
    </div>
  );
}
