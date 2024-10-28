import fetchStatus from 'constants/fetchStatuses';

export const unitOfMeasureFetchStatusSelector = (state) => state.unitOfMeasure.fetchStatus;
export const unitOfMeasureIsLoadingSelector = (state) => state.unitOfMeasure.fetchStatus === fetchStatus.REQUEST;
export const unitOfMeasureErrorSelector = (state) => state.unitOfMeasure.error;
export const unitOfMeasureListSelector = (state) => state.unitOfMeasure.list;
