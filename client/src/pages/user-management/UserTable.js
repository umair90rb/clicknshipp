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
    width: 100
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 150
  },
  {
    field: 'phone',
    headerName: 'Phone',
    width: 150
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150
  },
  {
    field: 'roles',
    headerName: 'Roles',
    width: 150
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    type: 'actions',
    cellClassName: 'actions',
    getActions: ({ id }) => [
      <GridActionsCellItem
        key={id}
        icon={<EditIcon />}
        label="View"
        className="textPrimary"
        onClick={handleEditAction(id)}
        color="inherit"
      />,
      <GridActionsCellItem
        key={id}
        icon={<NoAccountsIcon />}
        label="Disable"
        className="textPrimary"
        onClick={handleDeleteAction(id)}
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

  const handleDisableUser = (id) => async () => {
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

  const handleUpdate = (data, index) => () => {
    dispatch(setUserForUpdate({ data, index }));
    openUpateForm(true);
  };

  if (userIsLoading) {
    return null;
  }

  console.log(users);

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={users}
        columns={columns(handleUpdate, handleDisableUser)}
      />
    </div>
  );
}
