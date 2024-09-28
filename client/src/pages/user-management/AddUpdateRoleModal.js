import { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Modal } from '@mui/material';
import AddRoleForm from './AddRoleForm';
import UpdateRoleForm from './UpdateRoleForm';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllPermissions, fetchAllRoles } from 'store/slices/acl/fetchACL';
import { aclPermissionsFetchStatusSelector, aclRolesFetchStatusSelector } from 'store/slices/acl/aclSelector';
import fetchStatus from 'constants/fetchStatuses';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export default function AddUpdateRoleModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const rolesFetchStatus = useSelector(aclRolesFetchStatusSelector);
  const permissionsFetchStatus = useSelector(aclPermissionsFetchStatusSelector);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (rolesFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllRoles());
    }
    if (permissionsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllPermissions());
    }
  }, []);

  return (
    <Modal open={visible} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} centered>
            <Tab label="Create Role" />
            <Tab label="Update Role" />
          </Tabs>
        </Box>
        {tab === 0 ? <AddRoleForm closeModal={onClose} /> : <UpdateRoleForm closeModal={onClose} />}
      </Box>
    </Modal>
  );
}
