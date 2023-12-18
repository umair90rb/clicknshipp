import fetchStatus from 'constants/fetchStatuses';

export const categoryFetchStatusSelector = (state) => state.category.fetchStatus;
export const categoryIsLoadingSelector = (state) => state.category.fetchStatus === fetchStatus.REQUEST;
export const categoryErrorSelector = (state) => state.category.error;
export const categoryCategoriesSelector = (state) => state.category.categories;
