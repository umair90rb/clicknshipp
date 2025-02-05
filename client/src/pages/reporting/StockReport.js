import { useSelector } from 'react-redux';
import { reportDataSelector } from 'store/slices/report/reportSelector';
import GridLinearProgress from './components/GridLinearProgress';
import ReportingGrid from './components/ReportingGrid';

const columns = [
  {
    field: 'name',
    headerName: 'Item/Material Name',
    flex: 1
  },
  {
    field: 'item_type',
    headerName: 'Type',
    flex: 0.75,
    valueFormatter: (params) =>
      params.value === 'finished_product' ? 'Item' : params.value === 'raw_material' ? 'Raw Material' : 'Packaging Material'
  },
  {
    field: 'opening',
    headerName: 'Opening Balance',
    flex: 1
  },
  {
    field: 'in',
    headerName: 'In',
    flex: 0.5
  },
  {
    field: 'out',
    headerName: 'Out',
    flex: 0.5
  },
  {
    field: 'closing',
    headerName: 'Closing Balance',
    flex: 1
  }
];

export default function StockReport() {
  const data = useSelector(reportDataSelector);

  return (
    <ReportingGrid
      heading="Stock Report"
      description="Stock report give you insight about the stock in, out, and current balance."
      rows={data}
      columns={columns}
    />
  );
}
