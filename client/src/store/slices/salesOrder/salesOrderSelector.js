import fetchStatus from 'constants/fetchStatuses';

export const salesOrderFetchStatusSelector = (state) => state.salesOrder.fetchStatus;
export const salesOrderIsLoadingSelector = (state) => state.salesOrder.fetchStatus === fetchStatus.REQUEST;
export const salesOrderErrorSelector = (state) => state.salesOrder.error;
export const salesOrderListSelector = (state) => state.salesOrder.list;

export const salesOrderCreateFetchStatusSelector = (state) => state.salesOrder.create.fetchStatus;
export const salesOrderCreate4IsLoadingSelector = (state) => state.salesOrder.create.fetchStatus === fetchStatus.REQUEST;
export const salesOrderCreateErrorSelector = (state) => state.salesOrder.create.error;
export const salesOrderCreateDataSelector = (state) => state.salesOrder.create.data;

export const salesOrderCreateViewModalVisibleSelector = (state) => state.salesOrder.create.viewModalVisible;
export const salesOrderCreateViewIdSelector = (state) => state.salesOrder.create.viewId;
export const salesOrderCreateCreateModalVisibleSelector = (state) => state.salesOrder.create.createModalVisible;
