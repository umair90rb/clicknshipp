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
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { fetchAllEmployee } from 'store/slices/employee/fetchEmployee';
import { employeeIsLoadingSelector, employeeListSelector } from 'store/slices/employee/employeeSelector';

const columns = (handleEditAction, handleDeleteAction) => [
  {
    field: 'id',
    headerName: 'ID.',
    width: 50
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 200
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200
  },
  {
    field: 'phone',
    headerName: 'Phone',
    width: 200
  },
  {
    field: 'hire_at',
    headerName: 'Hired At',
    width: 200
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 200,
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
            onClick={() => handleEditAction(row, null)}
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

export default function EmployeeTable() {
  const dispatch = useDispatch();
  const { hasPermission } = useAccess();
  const employeesIsLoading = useSelector(employeeIsLoadingSelector);
  const employees = useSelector(employeeListSelector);

  useEffect(() => {
    dispatch(fetchAllEmployee());
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
    <div style={{ width: '100%' }}>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        loading={employeesIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={employees}
        columns={columns(
          hasPermission(PERMISSIONS.PERMISSION_UPDATE_USER) ? handleUpdate : undefined,
          hasPermission(PERMISSIONS.PERMISSION_DELETE_USER) ? handleDisableUser : undefined
        )}
      />
    </div>
  );
}
