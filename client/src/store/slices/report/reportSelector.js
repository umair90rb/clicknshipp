import fetchStatus from 'constants/fetchStatuses';

export const reportAgentFetchStatusSelector = (state) => state.report.agent.fetchStatus;
export const reportAgentIsLoadingSelector = (state) => state.report.agent.fetchStatus === fetchStatus.REQUEST;
export const reportAgentErrorSelector = (state) => state.report.agent.error;
export const reportAgentDataSelector = (state) => state.report.agent.data;
export const reportStartPeriodSelector = (state) => state.report.startPeriod;
export const reportEndPeriodSelector = (state) => state.report.endPeriod;
