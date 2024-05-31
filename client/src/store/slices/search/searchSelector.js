import fetchStatus from 'constants/fetchStatuses';

export const searchFetchStatusSelector = (state) => state.search.fetchStatus;
export const searchIsLoadingSelector = (state) => state.search.fetchStatus === fetchStatus.REQUEST;
export const searchErrorSelector = (state) => state.search.error;
export const searchResultSelector = (state) => state.search.result;
