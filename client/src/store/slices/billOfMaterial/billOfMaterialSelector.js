import fetchStatus from 'constants/fetchStatuses';

export const billOfMaterialFetchStatusSelector = (state) => state.billOfMaterial.fetchStatus;
export const billOfMaterialIsLoadingSelector = (state) => state.billOfMaterial.fetchStatus === fetchStatus.REQUEST;
export const billOfMaterialErrorSelector = (state) => state.billOfMaterial.error;
export const billOfMaterialListSelector = (state) => state.billOfMaterial.list;
