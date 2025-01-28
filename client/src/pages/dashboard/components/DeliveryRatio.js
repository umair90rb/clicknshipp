import * as React from 'react';
import PieChart from './PieChart';
import { dashboardGraphDeliveryRatioSelector, dashboardGraphIsLoadingSelector } from 'store/slices/dashboard/dashboardSelector';
import { useSelector } from '../../../../node_modules/react-redux/es/exports';

export default function DeliveryRatio() {
  const graphIsLoading = useSelector(dashboardGraphIsLoadingSelector);
  const deliveryRatio = useSelector(dashboardGraphDeliveryRatioSelector);

  if (graphIsLoading) {
    return null;
  }

  return <PieChart percentage={isNaN(deliveryRatio) ? 0 : deliveryRatio} color="orange" width="100%" />;
}
