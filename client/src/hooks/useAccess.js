import { authPermissionsSelector, authRolesSelector } from 'store/slices/auth/authSelector';
import { useSelector } from 'react-redux';

const useAccess = () => {
  const roles = useSelector(authRolesSelector);
  const permissions = useSelector(authPermissionsSelector);

  const hasRole = (role) => {
    if (!roles && !roles?.length) {
      return false;
    }
    return roles.includes(role);
  };

  const hasPermission = (permission) => {
    if (!permission || (Array.isArray(permission) && !permission.length) || (!permissions && !permissions?.length)) {
      return false;
    }
    if (Array.isArray(permission)) {
      permission.some((p) => {
        console.log(p, permissions.includes(p));
        if (permissions?.includes(p)) {
          return true;
        }
      });
      return false;
    }
    return permissions?.includes(permission);
  };

  return { hasRole, hasPermission };
};

export default useAccess;
