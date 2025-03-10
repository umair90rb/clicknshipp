import fetchStatus from 'constants/fetchStatuses';

export const reportFetchStatusSelector = (state) => state.report.fetchStatus;
export const reportIsLoadingSelector = (state) => state.report.fetchStatus === fetchStatus.REQUEST;
export const reportErrorSelector = (state) => state.report.error;
export const reportDataSelector = (state) => state.report.data;
export const reportTypeSelector = (state) => state.report.type;
export const reportBrandSelector = (state) => state.report.brand;
export const reportChanelSelector = (state) => state.report.chanel;
export const reportCitiesSelector = (state) => state.report.cities;
export const reportDeliveryServicesAccountsSelector = (state) => state.report.deliveryServiceAccounts;
export const reportStartPeriodSelector = (state) => state.report.startPeriod;
export const reportEndPeriodSelector = (state) => state.report.endPeriod;
