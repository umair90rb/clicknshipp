import React, { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { UserAddOutlined } from '@ant-design/icons';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import EmployeeTable from './EmployeeTable';
import AddAllowanceModal from './AddAllowanceModal';
import { useNavigate } from 'react-router-dom';
import location from 'utils/location';
import AddDepartmentModal from './AddDepartmentModal';
import AddDesignationModal from './AddDesignationModal';

const EmployeeManagement = () => {
  const navigate = useNavigate();

  const [addAllowanceVisible, setAddAllowanceVisible] = useState(false);
  const showAddAllowanceModal = () => setAddAllowanceVisible(true);
  const hideAddAllowanceModal = () => setAddAllowanceVisible(false);

  const [addDepartmentVisible, setAddDepartmentVisible] = useState(false);
  const showAddDepartmentModal = () => setAddDepartmentVisible(true);
  const hideAddDepartmentModal = () => setAddDepartmentVisible(false);

  const [addDesignationVisible, setAddDesignationVisible] = useState(false);
  const showAddDesignationModal = () => setAddDesignationVisible(true);
  const hideAddDesignationModal = () => setAddDesignationVisible(false);

  const { hasPermission } = useAccess();

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Employees</Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_USER) && (
                <Grid item>
                  <Button variant="contained" startIcon={<UserAddOutlined />} onClick={showAddDepartmentModal}>
                    Add New Department
                  </Button>
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_USER) && (
                <Grid item>
                  <Button variant="contained" startIcon={<UserAddOutlined />} onClick={showAddDesignationModal}>
                    Add New Designation
                  </Button>
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_ROLE) && hasPermission(PERMISSIONS.PERMISSION_UPDATE_ROLE) && (
                <Grid item>
                  <Button variant="contained" startIcon={<PaymentsOutlinedIcon />} onClick={showAddAllowanceModal}>
                    Add New Allowance
                  </Button>
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_USER) && (
                <Grid item>
                  <Button variant="contained" startIcon={<UserAddOutlined />} onClick={() => navigate(location.newEmployee())}>
                    Add Employee
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <EmployeeTable />
        </MainCard>
      </Grid>
      <AddAllowanceModal visible={addAllowanceVisible} onClose={hideAddAllowanceModal} />
      <AddDepartmentModal visible={addDepartmentVisible} onClose={hideAddDepartmentModal} />
      <AddDesignationModal visible={addDesignationVisible} onClose={hideAddDesignationModal} />
    </>
  );
};

export default EmployeeManagement;
