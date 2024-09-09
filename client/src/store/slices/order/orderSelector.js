import fetchStatus from 'constants/fetchStatuses';

export const orderListFetchStatusSelector = (state) => state.order.list.fetchStatus;
export const orderListIsLoadingSelector = (state) => state.order.list.fetchStatus === fetchStatus.REQUEST;
export const orderListErrorSelector = (state) => state.order.list.error;
export const orderListSelector = (state) => state.order.list.orders;
export const orderPageSelector = (state) => state.order.list.page;
export const orderPageSizeSelector = (state) => state.order.list.pageSize;
export const orderTotalSelector = (state) => state.order.list.total;
export const orderFiltersSelector = (state) => state.order.list.filters;
export const orderChanelFiltersSelector = (state) => state.order.list.chanelFilter;
export const orderSortSelector = (state) => state.order.list.sort;
export const orderNextOrderSelector = (state) => state.order.list.nextOrder;
export const orderPreOrderSelector = (state) => state.order.list.preOrder;

export const orderCreateFetchStatusSelector = (state) => state.order.create.fetchStatus;
export const orderCreateIsLoadingSelector = (state) => state.order.create.fetchStatus === fetchStatus.REQUEST;
export const orderCreateErrorSelector = (state) => state.order.create.error;

export const orderImportFetchStatusSelector = (state) => state.order.import.fetchStatus;
export const orderImportIsLoadingSelector = (state) => state.order.import.fetchStatus === fetchStatus.REQUEST;
export const orderImportErrorSelector = (state) => state.order.import.error;
