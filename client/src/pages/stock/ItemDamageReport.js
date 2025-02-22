import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { fetchStockHistory } from 'store/slices/stock/fetchStock';
import { formatDateTime, parseTimestampToDate } from 'utils/format-date';
import CustomDialog from 'components/CustomDialog';
import DateRangePicker from 'components/DatePicker';

const columns = [
  {
    field: 'quantity',
    headerName: 'Quantity',
    flex: 1.25
  },
  {
    field: 'movement_type',
    headerName: 'Movement',
    flex: 0.5
  },
  {
    field: 'location',
    headerName: 'Store',
    valueGetter: (value) => value?.row?.location?.name,
    flex: 1.25
  },
  {
    field: 'gate_pass_no',
    headerName: 'IGP No',
    flex: 1
  },
  {
    field: 'gate_pass_date',
    headerName: 'IGP Date',
    flex: 1,
    valueFormatter: ({ value }) => (value ? parseTimestampToDate(value) : value)
  },
  {
    field: 'comment',
    headerName: 'Comment',
    flex: 1.25
  },
  {
    field: 'createdAt',
    headerName: 'Date',
    valueGetter: (value) => formatDateTime(value?.row?.createdAt)
  }
];

export default function ItemDamageReport({ itemIdAndType, visible, onClose }) {
  const dispatch = useDispatch();
  const [startPeriod, setStartPeriod] = useState();
  const [endPeriod, setEndPeriod] = useState();

  const [report, setReport] = useState({
    loading: false,
    error: null,
    rows: []
  });

  useEffect(() => {
    // if (!visible) return;
    // dispatch(fetchStockHistory({ body: itemIdAndType })).then((action) => {
    //   if (action.type === 'stock/history/fetch/fulfilled') {
    //     setReport({ loading: false, rows: action.payload.data?.history, error: null });
    //   } else {
    //     setReport({ loading: false, rows: [], error: action.payload.error });
    //   }
    // });

    return () => {
      setReport({ loading: false, error: null, rows: [] });
    };
  }, [visible]);

  return (
    <CustomDialog printable visible={visible} onClose={onClose} maxWidth="lg" dividers={false} title="Item Damage Report" enableBackdrop>
      <DateRangePicker
        startPeriod={startPeriod}
        endPeriod={endPeriod}
        onStartDateSelect={(date) => setStartPeriod(date)}
        onEndDateSelect={(date) => setEndPeriod(date)}
      />
      {/* <DataGrid
        autoHeight
        getRowHeight={() => 'auto'}
        hideFooterPagination={true}
        loading={history.loading}
        hidePagination={true}
        rows={history?.rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
      /> */}
    </CustomDialog>
  );
}
