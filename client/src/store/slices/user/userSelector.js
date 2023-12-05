import fetchStatus from 'constants/fetchStatuses';

export const userFetchStatusSelector = (state) => state.user.fetchStatus;
export const userIsLoadingSelector = (state) => state.user.fetchStatus === fetchStatus.REQUEST;
export const userErrorSelector = (state) => state.user.error;
export const userUsersSelector = (state) => state.user.users;

export const userUpdateUserData = (state) => state.user.update;
