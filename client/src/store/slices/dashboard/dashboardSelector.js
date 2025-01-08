import fetchStatus from 'constants/fetchStatuses';

export const dashboardFetchStatusSelector = (state) => state.dashboard.fetchStatus;
export const dashboardIsLoadingSelector = (state) => state.dashboard.fetchStatus === fetchStatus.REQUEST;
export const dashboardErrorSelector = (state) => state.dashboard.error;
export const dashboardStatsSelector = (state) => state.dashboard.stats;
export const dashboardCompareStatsSelector = (state) => state.dashboard.compare;

export const dashboardStartPeriodSelector = (state) => state.dashboard.startPeriod;
export const dashboardEndPeriodSelector = (state) => state.dashboard.endPeriod;

export const dashboardCompareStartPeriodSelector = (state) => state.dashboard.compareStartPeriod;
export const dashboardCompareEndPeriodSelector = (state) => state.dashboard.compareEndPeriod;

export const dashboardGraphFetchStatusSelector = (state) => state.dashboard.graph.fetchStatus;
export const dashboardGraphIsLoadingSelector = (state) => state.dashboard.graph.fetchStatus === fetchStatus.REQUEST;
export const dashboardGraphErrorSelector = (state) => state.dashboard.graph.error;
export const dashboardGraphSalesTrendSelector = (state) => state.dashboard.graph.salesTrend;
export const dashboardGraphDeliveryRatioSelector = (state) => state.dashboard.graph.deliveryRatio;

export const dashboardGraphStartPeriodSelector = (state) => state.dashboard.graph.startPeriod;
export const dashboardGraphEndPeriodSelector = (state) => state.dashboard.graph.endPeriod;
