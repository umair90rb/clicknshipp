import fetchStatus from 'constants/fetchStatuses';

export const employeeFetchStatusSelector = (state) => state.employee.fetchStatus;
export const employeeIsLoadingSelector = (state) => state.employee.fetchStatus === fetchStatus.REQUEST;
export const employeeErrorSelector = (state) => state.employee.error;
export const employeeListSelector = (state) => state.employee.list;
