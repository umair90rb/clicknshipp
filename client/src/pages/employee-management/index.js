import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { UserAddOutlined } from '@ant-design/icons';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import AuthRegister from 'pages/authentication/auth-forms/AuthRegister';
import { useSelector } from 'react-redux';
import { userUsersSelector } from 'store/slices/user/userSelector';
import UserTable from './UserTable';
import AddUpdateRoleModal from './AddUpdateRoleModal';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

const EmployeeManagement = () => {
  const users = useSelector(userUsersSelector);

  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const handleOpenAddUserModal = () => setOpenAddUserModal(true);
  const handleCloseAddUserModal = () => setOpenAddUserModal(false);

  const [openAddRoleModal, setOpenAddRoleModal] = useState(false);
  const handleOpenAddRoleModal = () => setOpenAddRoleModal(true);
  const handleCloseAddRoleModal = () => setOpenAddRoleModal(false);

  const { hasPermission } = useAccess();

  useEffect(() => {
    if (openAddUserModal) setOpenAddUserModal(false);
  }, [users]);

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Users</Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_ROLE) && hasPermission(PERMISSIONS.PERMISSION_UPDATE_ROLE) && (
                <Grid item>
                  <Button variant="contained" startIcon={<AddModeratorIcon />} onClick={handleOpenAddRoleModal}>
                    Manage Roles
                  </Button>
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_USER) && (
                <Grid item>
                  <Button variant="contained" startIcon={<UserAddOutlined />} onClick={handleOpenAddUserModal}>
                    Add User
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <UserTable orderBy="id" order="asc" openUpateForm={setOpenAddUserModal} />
        </MainCard>
      </Grid>
      <Modal
        open={openAddUserModal}
        onClose={handleCloseAddUserModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AuthRegister />
        </Box>
      </Modal>
      <Modal
        open={openAddRoleModal}
        onClose={handleCloseAddRoleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddUpdateRoleModal handleCloseAddRoleModal={handleCloseAddRoleModal} />
        </Box>
      </Modal>
    </>
  );
};

export default EmployeeManagement;
