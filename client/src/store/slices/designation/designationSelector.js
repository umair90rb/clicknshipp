import fetchStatus from 'constants/fetchStatuses';

export const designationFetchStatusSelector = (state) => state.designation.fetchStatus;
export const designationIsLoadingSelector = (state) => state.designation.fetchStatus === fetchStatus.REQUEST;
export const designationErrorSelector = (state) => state.designation.error;
export const designationListSelector = (state) => state.designation.list;
