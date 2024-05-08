import fetchStatus from 'constants/fetchStatuses';

export const deliveryServiceAccountsFetchStatusSelector = (state) => state.deliveryServiceAccounts.fetchStatus;
export const deliveryServiceAccountsIsLoadingSelector = (state) => state.deliveryServiceAccounts.fetchStatus === fetchStatus.REQUEST;
export const deliveryServiceAccountsErrorSelector = (state) => state.deliveryServiceAccounts.error;
export const deliveryServiceAccountsListSelector = (state) => state.deliveryServiceAccounts.accounts;
