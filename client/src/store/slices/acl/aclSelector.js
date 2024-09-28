import fetchStatus from 'constants/fetchStatuses';

export const aclRolesFetchStatusSelector = (state) => state.acl.roles.fetchStatus;
export const aclRolesIsLoadingSelector = (state) => state.acl.roles.fetchStatus === fetchStatus.REQUEST;
export const aclRolesErrorSelector = (state) => state.acl.roles.error;
export const aclRolesListSelector = (state) => state.acl.roles.list;

export const aclPermissionsFetchStatusSelector = (state) => state.acl.permissions.fetchStatus;
export const aclPermissionsIsLoadingSelector = (state) => state.acl.permissions.fetchStatus === fetchStatus.REQUEST;
export const aclPermissionsErrorSelector = (state) => state.acl.permissions.error;
export const aclPermissionsListSelector = (state) => state.acl.permissions.list;
