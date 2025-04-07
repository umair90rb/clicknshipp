import fetchStatus from 'constants/fetchStatuses';

export const notificationFetchStatusSelector = (state) => state.notification.fetchStatus;
export const notificationIsLoadingSelector = (state) => state.notification.fetchStatus === fetchStatus.REQUEST;
export const notificationErrorSelector = (state) => state.notification.error;
export const notificationListSelector = (state) => state.notification.list;
export const notificationLimitSelector = (state) => state.notification.limit;
export const notificationOffsetSelector = (state) => state.notification.offset;
export const notificationCountSelector = (state) => state.notification.list.length;
