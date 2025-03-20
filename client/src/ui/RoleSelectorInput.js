import CustomChipSelect from 'components/CustomChipSelect';
import useRolesFetch from 'hooks/useRolesFetch';
import { useSelector } from 'react-redux';
import { aclRolesIsLoadingSelector, aclRolesListSelector } from 'store/slices/acl/aclSelector';

export default function RoleSelectorInput({ value, onChange, onBlur, error, multiple = false }) {
  const rolesIsLoading = useSelector(aclRolesIsLoadingSelector);
  const roles = useSelector(aclRolesListSelector);

  const { refresh } = useRolesFetch();
  return (
    <CustomChipSelect
      fullWidth
      multiple={multiple}
      getLabelFromOptions
      label="Select Role"
      loading={rolesIsLoading}
      withRefresh={refresh}
      error={error}
      value={value}
      name={multiple ? 'roles' : 'role'}
      onChange={onChange}
      onBlur={onBlur}
      options={roles.map(({ id, name }) => ({ value: id, label: name }))}
    />
  );
}
