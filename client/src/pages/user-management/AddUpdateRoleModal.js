import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import AddRoleForm from './AddRoleForm';
import UpdateRoleForm from './UpdateRoleForm';

const AddUpdateRoleModal = ({ handleCloseAddRoleModal }) => {
  const [tab, setTab] = useState(0);
  return (
    <>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} centered>
          <Tab label="Create Role" />
          <Tab label="Update Role" />
        </Tabs>
      </Box>
      {tab === 0 ? <AddRoleForm closeModal={handleCloseAddRoleModal} /> : <UpdateRoleForm closeModal={handleCloseAddRoleModal} />}
    </>
  );
};

export default AddUpdateRoleModal;
