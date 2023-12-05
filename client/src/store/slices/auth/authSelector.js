import fetchStatus from 'constants/fetchStatuses';

export const authFetchStatusSelector = (state) => state.auth.fetchStatus;
export const authIsLoadingSelector = (state) => state.auth.fetchStatus === fetchStatus.REQUEST;
export const authErrorSelector = (state) => state.auth.error;

export const authUserSelector = (state) => state.auth.user;
export const authTokenSelector = (state) => state.auth.token;
