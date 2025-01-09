import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RestoreIcon from '@mui/icons-material/Restore';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { stockIsLoadingSelector, stockStocksSelector } from 'store/slices/stock/stockSelector';
import { fetchAllStock } from 'store/slices/stock/fetchStock';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
const columns = (showHistory) => [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.25
  },
  {
    field: 'name',
    headerName: 'Item Name',
    flex: 1.75,
    valueGetter: (value) => `${value?.row?.item?.name || value?.row.raw?.name}`
  },
  {
    field: 'current_level',
    headerName: 'Current Stock',
    flex: 1,
    valueGetter: (value) => `${value?.value} ${value?.row.raw?.unit_of_measure || ''}`
  },
  {
    field: 'location',
    headerName: 'Store',
    flex: 1,
    valueGetter: (value) => `${value?.value?.name || ''}`
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    type: 'actions',
    cellClassName: 'actions',
    getActions: (value) => {
      const actions = [];
      if (showHistory) {
        actions.push(
          <GridActionsCellItem
            key={value.row?.id}
            icon={<RestoreIcon />}
            label="View"
            className="textPrimary"
            onClick={() =>
              showHistory(value?.row?.raw?.id || value?.row?.item?.id, value?.row?.item === null ? 'raw_material' : 'finished_product')
            }
            color="inherit"
          />
        );
      }
      return actions;
    }
  }
];

export default function StockTable({ showHistory }) {
  const dispatch = useDispatch();
  const stockIsLoading = useSelector(stockIsLoadingSelector);
  const stock = useSelector(stockStocksSelector);
  const { hasPermission } = useAccess();

  useEffect(() => {
    dispatch(fetchAllStock());
  }, []);

  return (
    <div style={{ width: '100%' }}>
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
        columns={columns(hasPermission(PERMISSIONS.PERMISSION_VIEW_STOCK_HISTORY) ? showHistory : undefined)}
      />
    </div>
  );
}
