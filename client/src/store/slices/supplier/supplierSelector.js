import fetchStatus from 'constants/fetchStatuses';

export const supplierFetchStatusSelector = (state) => state.supplier.fetchStatus;
export const supplierIsLoadingSelector = (state) => state.supplier.fetchStatus === fetchStatus.REQUEST;
export const supplierErrorSelector = (state) => state.supplier.error;
export const supplierSuppliersSelector = (state) => state.supplier.suppliers;
