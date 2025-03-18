import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userIsLoadingSelector, userUsersSelector } from 'store/slices/user/userSelector';
import { fetchAllUser, fetchDisableUser } from 'store/slices/user/fetchUser';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { authUserSelector } from 'store/slices/auth/authSelector';
import { setMessage } from 'store/slices/util/utilSlice';
import { setUserForUpdate, disableUser } from 'store/slices/user/userSlice';
import { userService } from 'api/index';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import useUsersFetch from 'hooks/useUsersFetch';
import CustomGrid from 'components/CustomGrid';

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
    flex: 1,
    valueGetter: ({ value }) => value.map((roles) => roles.name)
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
            icon={<NoAccountsIcon />}
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

export default function UserTable({ updateUser }) {
  const dispatch = useDispatch();
  const userIsLoading = useSelector(userIsLoadingSelector);
  const users = useSelector(userUsersSelector);
  const user = useSelector(authUserSelector);
  const { hasPermission } = useAccess();
  const { refresh } = useUsersFetch();

  const handleDisableUser = async (id) => {
    if (id === user.id) {
      dispatch(setMessage({ message: "You can't disabled yourself!", type: 'error' }));
      return;
    }
    try {
      const { type, payload } = await dispatch(fetchDisableUser({ id }));
      console.log(type, payload);
      if (type === 'user/disable/fetch/fulfilled') {
        dispatch(setMessage({ message: payload.data.message, type: 'success' }));
        dispatch(disableUser(id));
      } else {
        throw new Error(payload.data.error);
      }
    } catch (error) {
      console.log(error);
      dispatch(setMessage({ message: 'User not disabled!', type: 'error' }));
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <CustomGrid
        loading={userIsLoading}
        withRefresh={refresh}
        rows={users}
        getRowHeight={() => 'auto'}
        columns={columns(
          hasPermission(PERMISSIONS.PERMISSION_UPDATE_USER) ? updateUser : undefined,
          hasPermission(PERMISSIONS.PERMISSION_DELETE_USER) ? handleDisableUser : undefined
        )}
      />
    </div>
  );
}
