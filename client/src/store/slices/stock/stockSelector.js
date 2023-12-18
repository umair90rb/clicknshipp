import fetchStatus from 'constants/fetchStatuses';

export const stockFetchStatusSelector = (state) => state.stock.fetchStatus;
export const stockIsLoadingSelector = (state) => state.stock.fetchStatus === fetchStatus.REQUEST;
export const stockErrorSelector = (state) => state.stock.error;
export const stockStocksSelector = (state) => state.stock.stocks;
