import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userIsLoadingSelector, userUsersSelector } from 'store/slices/user/userSelector';
import { fetchAllUser } from 'store/slices/user/fetchUser';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { authUserSelector } from 'store/slices/auth/authSelector';
import { setMessage } from 'store/slices/util/utilSlice';
import { setUserForUpdate, disableUser } from 'store/slices/user/userSlice';
import { employeeService } from 'api/index';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { fetchAllEmployee, fetchDeleteEmployee } from 'store/slices/employee/fetchEmployee';
import { employeeIsLoadingSelector, employeeListSelector } from 'store/slices/employee/employeeSelector';
import { useNavigate } from 'react-router-dom';
import location from 'utils/location';
import { deleteEmployee } from 'store/slices/employee/employeeSlice';

const columns = (handleViewAction, handleDeleteAction) => [
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
      if (handleViewAction) {
        actions.push(
          <GridActionsCellItem
            key={id}
            icon={<VisibilityIcon />}
            label="View"
            className="textPrimary"
            onClick={() => handleViewAction(id)}
            color="inherit"
          />
        );
      }
      if (handleDeleteAction) {
        actions.push(
          <GridActionsCellItem
            key={id}
            icon={<DeleteForeverOutlinedIcon color="error" />}
            label="View"
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
  const navigate = useNavigate();
  const employeesIsLoading = useSelector(employeeIsLoadingSelector);
  const employees = useSelector(employeeListSelector);

  useEffect(() => {
    dispatch(fetchAllEmployee());
  }, []);

  const handleViewEmployee = (id) => navigate(location.viewEmployee(id));

  const handleDeleteEmployee = async (id) => {
    const { payload, type } = await dispatch(fetchDeleteEmployee({ id }));
    if (type === 'employee/delete/fetch/fulfilled') {
      dispatch(deleteEmployee(id));
      dispatch(setMessage({ type: 'success', message: payload.data.message }));
    } else {
      if (type === 'employee/delete/fetch/rejected') {
        dispatch(setMessage({ type: 'error', message: payload.error.message || 'Something goes wrong, try again!' }));
      }
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
        loading={employeesIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={employees}
        columns={columns(handleViewEmployee, hasPermission(PERMISSIONS.PERMISSION_DELETE_USER) ? handleDeleteEmployee : undefined)}
      />
    </div>
  );
}
