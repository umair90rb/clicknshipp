import fetchStatus from 'constants/fetchStatuses';

export const customerFetchStatusSelector = (state) => state.customer.fetchStatus;
export const customerIsLoadingSelector = (state) => state.customer.fetchStatus === fetchStatus.REQUEST;
export const customerErrorSelector = (state) => state.customer.error;
export const customerCustomersSelector = (state) => state.customer.customers;

export const customerPageSelector = (state) => state.customer.page;
export const customerPageSizeSelector = (state) => state.customer.pageSize;
export const customerTotalSelector = (state) => state.customer.total;
export const customerSortSelector = (state) => state.customer.sort;

export const customerViewFetchStatusSelector = (state) => state.customer.view.fetchStatus;
export const customerViewIsLoadingSelector = (state) => state.customer.view.fetchStatus === fetchStatus.REQUEST;
export const customerViewErrorSelector = (state) => state.customer.view.error;
export const customerViewDataSelector = (state) => state.customer.view.data;
