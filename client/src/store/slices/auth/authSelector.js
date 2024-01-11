import fetchStatus from 'constants/fetchStatuses';

export const authFetchStatusSelector = (state) => state.auth.fetchStatus;
export const authIsLoadingSelector = (state) => state.auth.fetchStatus === fetchStatus.REQUEST;
export const authErrorSelector = (state) => state.auth.error;

export const authUserSelector = (state) => state.auth.user;
export const authRolesSelector = (state) => state.auth.user?.roles;
export const authPermissionsSelector = (state) => state.auth.user?.permissions;
export const authTokenSelector = (state) => state.auth.token;
