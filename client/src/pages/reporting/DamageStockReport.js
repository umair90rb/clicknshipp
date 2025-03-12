import { useSelector } from 'react-redux';
import { reportDataSelector } from 'store/slices/report/reportSelector';
import ReportingGrid from './components/ReportingGrid';

const columns = [
  {
    field: 'name',
    headerName: 'Item/Material Name',
    flex: 1,
    valueGetter: (params) => {
      return params.row.raw.name || params.row.item.name;
    }
  },
  {
    field: 'item_type',
    headerName: 'Type',
    flex: 0.75,
    valueFormatter: (params) =>
      params.value === 'finished_product' ? 'Item' : params.value === 'raw_material' ? 'Raw Material' : 'Packaging Material'
  },
  {
    field: 'balance',
    headerName: 'Current Damage Balance',
    flex: 1
  }
];

export default function DamageStockReport() {
  const data = useSelector(reportDataSelector);

  return (
    <ReportingGrid
      heading="Damage Stock Report"
      description="Damage stock report give you current balance of the damage stock."
      rows={data}
      columns={columns}
    />
  );
}
