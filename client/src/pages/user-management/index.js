import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { UserAddOutlined } from '@ant-design/icons';
import AuthRegister from 'pages/authentication/auth-forms/AuthRegister';
import { useSelector } from 'react-redux';
import { userUsersSelector } from 'store/slices/user/userSelector';
import UserTable from './UserTable';

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

const UserManagment = () => {
  const users = useSelector(userUsersSelector);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (open) setOpen(false);
  }, [users]);

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Users</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" startIcon={<UserAddOutlined />} onClick={handleOpen}>
              Add User
            </Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <UserTable orderBy="id" order="asc" openUpateForm={setOpen} />
        </MainCard>
      </Grid>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <AuthRegister />
        </Box>
      </Modal>
    </>
  );
};

export default UserManagment;
