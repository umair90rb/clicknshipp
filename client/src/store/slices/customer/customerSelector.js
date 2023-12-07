import fetchStatus from 'constants/fetchStatuses';

export const customerFetchStatusSelector = (state) => state.customer.fetchStatus;
export const customerIsLoadingSelector = (state) => state.customer.fetchStatus === fetchStatus.REQUEST;
export const customerErrorSelector = (state) => state.customer.error;
export const customerCustomersSelector = (state) => state.customer.customers;
