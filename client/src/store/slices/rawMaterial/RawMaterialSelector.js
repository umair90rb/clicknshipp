import fetchStatus from 'constants/fetchStatuses';

export const rawMaterialFetchStatusSelector = (state) => state.rawMaterial.fetchStatus;
export const rawMaterialIsLoadingSelector = (state) => state.rawMaterial.fetchStatus === fetchStatus.REQUEST;
export const rawMaterialErrorSelector = (state) => state.rawMaterial.error;
export const rawMaterialListSelector = (state) => state.rawMaterial.list;
