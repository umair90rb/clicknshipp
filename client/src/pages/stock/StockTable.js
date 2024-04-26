import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RestoreIcon from '@mui/icons-material/Restore';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { stockIsLoadingSelector, stockStocksSelector } from 'store/slices/stock/stockSelector';
import { fetchAllStock } from 'store/slices/stock/fetchStock';
const columns = (showHistory, receiveStock) => [
  {
    field: 'item',
    headerName: 'ID',
    flex: 1,
    valueGetter: ({ value }) => value.item_id
  },
  {
    field: 'item',
    headerName: 'Item Name',
    flex: 1,
    valueGetter: ({ value }) => value.name
  },
  {
    field: 'level',
    headerName: 'Current Stock',
    flex: 1
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    type: 'actions',
    cellClassName: 'actions',
    getActions: ({ id, row }) => [
      <GridActionsCellItem
        key={id}
        icon={<RestoreIcon />}
        label="View"
        className="textPrimary"
        onClick={() => showHistory(row.id)}
        color="inherit"
      />,
      <GridActionsCellItem
        key={id}
        icon={<CallReceivedIcon />}
        label="Disable"
        className="textPrimary"
        onClick={() => receiveStock(row.item.item_id)}
        color="inherit"
      />
    ]
  }
];

export default function StockTable({ receiveStock, showHistory }) {
  const dispatch = useDispatch();
  const stockIsLoading = useSelector(stockIsLoadingSelector);
  const stock = useSelector(stockStocksSelector);

  useEffect(() => {
    dispatch(fetchAllStock());
  }, []);

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        loading={stockIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={stock}
        columns={columns(showHistory, receiveStock)}
      />
    </div>
  );
}
