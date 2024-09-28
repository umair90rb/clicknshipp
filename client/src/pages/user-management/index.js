import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { UserAddOutlined } from '@ant-design/icons';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import { useSelector } from 'react-redux';
import { userUsersSelector } from 'store/slices/user/userSelector';
import UserTable from './UserTable';
import AddUpdateRoleModal from './AddUpdateRoleModal';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import AddUpdateUserModal from './AddUpdateUserModal';

export default function UserManagement() {
  const users = useSelector(userUsersSelector);
  const [userToUpdate, setUserToUpdate] = useState({});
  const [openAddUpdateUserModal, setOpenAddUpdateUserModal] = useState(false);

  const handleOpenAddUpdateUserModal = () => setOpenAddUpdateUserModal(true);

  const handleCloseAddUpdateUserModal = () => {
    setUserToUpdate({});
    setOpenAddUpdateUserModal(false);
  };

  const handleUpdateUser = (user) => {
    setUserToUpdate(user);
    handleOpenAddUpdateUserModal();
  };

  const [openAddRoleModal, setOpenAddRoleModal] = useState(false);
  const handleOpenAddRoleModal = () => setOpenAddRoleModal(true);
  const handleCloseAddRoleModal = () => setOpenAddRoleModal(false);

  const { hasPermission } = useAccess();

  useEffect(() => {
    if (openAddUpdateUserModal) handleCloseAddUpdateUserModal();
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
                  <Button variant="contained" startIcon={<UserAddOutlined />} onClick={handleOpenAddUpdateUserModal}>
                    Add User
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <UserTable orderBy="id" order="asc" updateUser={handleUpdateUser} />
        </MainCard>
      </Grid>
      <AddUpdateUserModal visible={openAddUpdateUserModal} onClose={handleCloseAddUpdateUserModal} userToUpdate={userToUpdate} />
      <AddUpdateRoleModal visible={openAddRoleModal} onClose={handleCloseAddRoleModal} />
    </>
  );
}
