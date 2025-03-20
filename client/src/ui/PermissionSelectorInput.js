import CustomChipSelect from 'components/CustomChipSelect';
import usePermissionsFetch from 'hooks/usePermissionsFetch';
import { useSelector } from 'react-redux';
import { aclPermissionsIsLoadingSelector, aclPermissionsListSelector } from 'store/slices/acl/aclSelector';

export default function PermissionSelectorInput({ value, onChange, onBlur, error }) {
  const permissions = useSelector(aclPermissionsListSelector);
  const permissionsIsLoading = useSelector(aclPermissionsIsLoadingSelector);

  const { refresh } = usePermissionsFetch();
  return (
    <CustomChipSelect
      fullWidth
      multiple
      getLabelFromOptions
      label="Select Permissions"
      loading={permissionsIsLoading}
      withRefresh={refresh}
      error={error}
      value={value}
      name="permissions"
      onChange={onChange}
      onBlur={onBlur}
      options={permissions.map(({ id, name }) => ({ value: id, label: name }))}
    />
  );
}
