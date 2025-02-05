import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { fetchStockHistory } from 'store/slices/stock/fetchStock';
import formatDate from 'utils/format-date';
import CustomDialog from 'components/CustomDialog';

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
    field: 'comment',
    headerName: 'Comment',
    flex: 1.25
  },
  {
    field: 'createdAt',
    headerName: 'Date',
    valueGetter: (value) => formatDate(value?.row?.createdAt)
  }
];

export default function StockHistory({ itemIdAndType, visible, onClose }) {
  const dispatch = useDispatch();
  const [history, setHistory] = useState({
    loading: true,
    error: null,
    rows: []
  });

  useEffect(() => {
    if (!visible) return;
    dispatch(fetchStockHistory({ body: itemIdAndType })).then((action) => {
      if (action.type === 'stock/history/fetch/fulfilled') {
        setHistory({ loading: false, rows: action.payload.data?.history, error: null });
      } else {
        setHistory({ loading: false, rows: [], error: action.payload.error });
      }
    });

    return () => {
      setHistory({ loading: true, error: null, rows: [] });
    };
  }, [visible]);

  return (
    <CustomDialog visible={visible} onClose={onClose} maxWidth="lg" dividers={false} title="Stock History" enableBackdrop>
      <DataGrid
        autoHeight
        getRowHeight={() => 'auto'}
        hideFooterPagination={true}
        loading={history.loading}
        hidePagination={true}
        rows={history?.rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
      />
    </CustomDialog>
  );
}
