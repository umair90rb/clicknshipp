import fetchStatus from 'constants/fetchStatuses';

export const departmentFetchStatusSelector = (state) => state.department.fetchStatus;
export const departmentIsLoadingSelector = (state) => state.department.fetchStatus === fetchStatus.REQUEST;
export const departmentErrorSelector = (state) => state.department.error;
export const departmentListSelector = (state) => state.department.list;
