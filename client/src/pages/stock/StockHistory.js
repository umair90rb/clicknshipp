import CustomView from 'components/CustomTable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchStock } from 'store/slices/stock/fetchStock';

const stockHistoryCell = [
  {
    id: 'amount',
    label: 'Quantity'
  },
  {
    id: 'expiry',
    label: 'Expiry'
  },
  {
    id: 'comment',
    label: 'Comment'
  },
  {
    id: 'comment',
    label: 'Comment'
  },
  {
    id: 'createdAt',
    label: 'Added at'
  }
];

const StockHistory = ({ id }) => {
  const dispatch = useDispatch();
  const [history, setHistory] = useState({
    loading: true,
    error: null,
    data: {}
  });

  useEffect(() => {
    dispatch(fetchStock({ id })).then((action) => {
      console.log(action, 'valueeeeeee');
      if (action.type === 'stock/fetch/fulfilled') {
        setHistory({ loading: false, data: action.payload.data.stock, error: null });
      } else {
        setHistory({ loading: false, data: {}, error: action.payload.data.error });
      }
    });
  }, []);

  console.log(history, 'history.loading');

  if (history.loading) {
    return null;
  }

  return <CustomView headCells={stockHistoryCell} order="asc" orderBy="id" data={history?.data?.history || []} />;
};

export default StockHistory;
