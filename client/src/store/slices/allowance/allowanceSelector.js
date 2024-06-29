import fetchStatus from 'constants/fetchStatuses';

export const allowanceFetchStatusSelector = (state) => state.allowance.fetchStatus;
export const allowanceIsLoadingSelector = (state) => state.allowance.fetchStatus === fetchStatus.REQUEST;
export const allowanceErrorSelector = (state) => state.allowance.error;
export const allowanceListSelector = (state) => state.allowance.list;
