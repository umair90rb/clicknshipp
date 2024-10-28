import fetchStatus from 'constants/fetchStatuses';

export const locationFetchStatusSelector = (state) => state.location.fetchStatus;
export const locationIsLoadingSelector = (state) => state.location.fetchStatus === fetchStatus.REQUEST;
export const locationErrorSelector = (state) => state.location.error;
export const locationListSelector = (state) => state.location.list;
