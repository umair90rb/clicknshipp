import { useSelector } from 'react-redux';
import { reportDataSelector } from 'store/slices/report/reportSelector';
import ReportingGrid from './components/ReportingGrid';

const columns = [
  {
    field: 'name',
    headerName: 'Channel Name',
    flex: 1,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.label;
      }
      return params.value;
    }
  },
  {
    field: 'shop_domain',
    headerName: 'Store shopify Address',
    flex: 1,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return '';
      }
      return params.value;
    }
  },
  {
    field: 'orders',
    headerName: 'No of Orders',
    description: 'Number of total orders generated',
    flex: 1,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalOrders;
      }
      return params.value;
    }
  },
  {
    field: 'total_items',
    headerName: 'No of Units',
    description: 'No of total item quantity in orders',
    flex: 1,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalItems;
      }
      return params.value;
    }
  },
];

export default function OrderGenerationReport() {
  const data = useSelector(reportDataSelector);

  return (
    <ReportingGrid
      heading="Order and Units Generation Report"
      description="This report will give you overview of you store order and units generation"
      rows={data}
      columns={columns}
    />
  );
}
