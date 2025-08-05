import fetchStatus from 'constants/fetchStatuses';

export const logFetchStatusSelector = (state) => state.log.fetchStatus;
export const logIsLoadingSelector = (state) => state.log.fetchStatus === fetchStatus.REQUEST;
export const logErrorSelector = (state) => state.log.error;
export const logListSelector = (state) => state.log.list;
