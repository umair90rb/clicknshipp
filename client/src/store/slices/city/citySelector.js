import fetchStatus from 'constants/fetchStatuses';

export const cityFetchStatusSelector = (state) => state.city.fetchStatus;
export const cityIsLoadingSelector = (state) => state.city.fetchStatus === fetchStatus.REQUEST;
export const cityErrorSelector = (state) => state.city.error;
export const cityCitiesSelector = (state) => state.city.cities;
