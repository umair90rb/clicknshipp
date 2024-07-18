import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userIsLoadingSelector, userUsersSelector } from 'store/slices/user/userSelector';
import { fetchAllUser } from 'store/slices/user/fetchUser';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { authUserSelector } from 'store/slices/auth/authSelector';
import { setMessage } from 'store/slices/util/utilSlice';
import { setUserForUpdate, disableUser } from 'store/slices/user/userSlice';
import { employeeService } from 'api/index';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { fetchAllEmployee } from 'store/slices/employee/fetchEmployee';
import { employeeIsLoadingSelector, employeeListSelector } from 'store/slices/employee/employeeSelector';
import { useNavigate } from 'react-router-dom';
import location from 'utils/location';

const columns = (handleViewAction) => [
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
        columns={columns(hasPermission(PERMISSIONS.PERMISSION_DELETE_USER) ? handleViewEmployee : undefined)}
      />
    </div>
  );
}
