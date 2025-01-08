import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { dashboardGraphIsLoadingSelector, dashboardGraphSalesTrendSelector } from 'store/slices/dashboard/dashboardSelector';
import { useSelector } from '../../../../node_modules/react-redux/es/exports';

export default function SalesTrend() {
  const graphIsLoading = useSelector(dashboardGraphIsLoadingSelector);
  const salesTrend = useSelector(dashboardGraphSalesTrendSelector);

  if (graphIsLoading) {
    return null;
  }
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'space-around' }}>
      <LineChart
        grid={{ vertical: true, horizontal: true }}
        height={270}
        series={salesTrend?.data}
        xAxis={[{ scaleType: 'point', data: salesTrend?.xLabels }]}
      />
    </div>
  );
}
