import fetchStatus from 'constants/fetchStatuses';

export const chanelFetchStatusSelector = (state) => state.chanel.fetchStatus;
export const chanelIsLoadingSelector = (state) => state.chanel.fetchStatus === fetchStatus.REQUEST;
export const chanelErrorSelector = (state) => state.chanel.error;
export const chanelChanelsSelector = (state) => state.chanel.chanels;
