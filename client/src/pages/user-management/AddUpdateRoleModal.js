import AddRoleForm from './AddRoleForm';
import UpdateRoleForm from './UpdateRoleForm';
import CustomDialog from 'components/CustomDialog';
import CustomTabs from 'components/CustomTabs';
import useRolesFetch from 'hooks/useRolesFetch';
import usePermissionsFetch from 'hooks/usePermissionsFetch';

export default function AddUpdateRoleModal({ visible, onClose }) {
  useRolesFetch();
  usePermissionsFetch();
  return (
    <CustomDialog title="Create/Update User Roles" visible={visible} onClose={onClose} maxWidth="md">
      <CustomTabs
        tabs={[
          { label: 'Create Role', children: <AddRoleForm closeModal={onClose} /> },
          { label: 'Update Role', children: <UpdateRoleForm closeModal={onClose} /> }
        ]}
        centered
      />
    </CustomDialog>
  );
}
