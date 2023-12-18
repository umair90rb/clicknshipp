import fetchStatus from 'constants/fetchStatuses';

export const brandFetchStatusSelector = (state) => state.brand.fetchStatus;
export const brandIsLoadingSelector = (state) => state.brand.fetchStatus === fetchStatus.REQUEST;
export const brandErrorSelector = (state) => state.brand.error;
export const brandBrandsSelector = (state) => state.brand.brands;
