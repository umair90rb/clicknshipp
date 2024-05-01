import fetchStatus from 'constants/fetchStatuses';

export const authFetchStatusSelector = (state) => state.auth.login.fetchStatus;
export const authIsLoadingSelector = (state) => state.auth.login.fetchStatus === fetchStatus.REQUEST;
export const authErrorSelector = (state) => state.auth.login.error;

export const authProfileFetchStatusSelector = (state) => state.auth.profile.fetchStatus;
export const authProfileIsLoadingSelector = (state) => state.auth.profile.fetchStatus === fetchStatus.REQUEST;
export const authProfileErrorSelector = (state) => state.auth.profile.error;

export const authTokenSelector = (state) => state.auth.token;
export const authUserSelector = (state) => state.auth.user;
export const authRolesSelector = (state) => state.auth.user?.roles;
export const authPermissionsSelector = (state) => state.auth.user?.permissions;
export const authBrandsSelector = (state) => state.auth.user?.brands;
export const authSettingsSelector = (state) => state.auth.user?.settings;
