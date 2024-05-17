import fetchStatus from 'constants/fetchStatuses';

export const dashboardFetchStatusSelector = (state) => state.dashboard.fetchStatus;
export const dashboardIsLoadingSelector = (state) => state.dashboard.fetchStatus === fetchStatus.REQUEST;
export const dashboardErrorSelector = (state) => state.dashboard.error;
export const dashboardStatsSelector = (state) => state.dashboard.stats;
export const dashboardStartPeriodSelector = (state) => state.dashboard.startPeriod;
export const dashboardEndPeriodSelector = (state) => state.dashboard.endPeriod;
