import { useSelector } from 'react-redux';
import { reportDataSelector } from 'store/slices/report/reportSelector';
import GridLinearProgress from './components/GridLinearProgress';
import ReportingGrid from './components/ReportingGrid';

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.label;
      }
      return params.value;
    }
  },
  {
    field: 'unit_generated',
    headerName: 'Unit Generated',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnitGenerated;
      }
      return params.value;
    }
  },
  {
    field: 'unit_confirmed',
    headerName: 'Unit Confirmed',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnitConfirmed;
      }
      return params.value;
    }
  },
  {
    field: 'unit_no_pick',
    headerName: 'Unit No Pick',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnitNoPick;
      }
      return params.value;
    }
  },
  {
    field: 'unit_cancel',
    headerName: 'Unit Cancel',
    flex: 0.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.totalUnitCancel;
      }
      return params.value;
    }
  },
  {
    field: 'percentage',
    headerName: 'Percentage%',
    flex: 1,
    renderCell: (params) => {
      let percentage = ((params.row.unit_confirmed / params.row.unit_generated) * 100).toFixed(2);
      if (params.row.id === 'TOTAL') {
        percentage = ((params.row.totalUnitConfirmed / params.row.totalUnitGenerated) * 100).toFixed(2);
      }
      return <GridLinearProgress percentage={percentage} />;
    }
  }
];

export default function UnitReport() {
  const data = useSelector(reportDataSelector);

  return (
    <ReportingGrid
      heading="Product Report"
      description="Product report give you insight about the products order generation, process, etc"
      rows={data}
      columns={columns}
    />
  );
}
