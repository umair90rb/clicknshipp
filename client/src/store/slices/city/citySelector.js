import fetchStatus from 'constants/fetchStatuses';

export const cityFetchStatusSelector = (state) => state.city.fetchStatus;
export const cityIsLoadingSelector = (state) => state.city.fetchStatus === fetchStatus.REQUEST;
export const cityErrorSelector = (state) => state.city.error;
export const cityCitiesSelector = (state) => state.city.cities;

export const cityCreateFetchStatusSelector = (state) => state.city.create.fetchStatus;
export const cityCreateIsLoadingSelector = (state) => state.city.create.fetchStatus === fetchStatus.REQUEST;
export const cityCreateErrorSelector = (state) => state.city.create.error;
export const cityCreateCitiesSelector = (state) => state.city.create.cities;
