import fetchStatus from 'constants/fetchStatuses';

export const itemFetchStatusSelector = (state) => state.item.fetchStatus;
export const itemIsLoadingSelector = (state) => state.item.fetchStatus === fetchStatus.REQUEST;
export const itemErrorSelector = (state) => state.item.error;
export const itemItemsSelector = (state) => state.item.items;
