import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Box } from '@mui/material';
import CustomView from 'components/CustomTable';
import { DataGrid } from '@mui/x-data-grid';
import { fetchStockHistory } from 'store/slices/stock/fetchStock';
import { splitAndToUpperCase } from 'utils/string-utils';
import { getDate } from 'utils/format-date';
import CustomDialog from 'components/CustomDialog';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75vw',
  maxHeight: '75vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

const columns = [
  {
    field: 'id',
    headerName: 'ID#',
    flex: 0.25
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    flex: 1.25
  },
  {
    field: 'movement_type',
    headerName: 'Movement',
    flex: 0.25
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
    field: 'item_type',
    headerName: 'Type',
    valueGetter: (value) => splitAndToUpperCase(value?.row?.item_type),
    flex: 1.25
  },
  {
    field: 'createdAt',
    headerName: 'Added at',
    valueGetter: (value) => getDate(value?.row?.createdAt)
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
      />
    </CustomDialog>
  );
}
