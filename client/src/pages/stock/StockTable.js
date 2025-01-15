import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RestoreIcon from '@mui/icons-material/Restore';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  GridToolbarExport
} from '@mui/x-data-grid';
import { stockIsLoadingSelector, stockStocksSelector } from 'store/slices/stock/stockSelector';
import { fetchAllStock } from 'store/slices/stock/fetchStock';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { GridDropdownFilter } from 'pages/order-management/GridDropdownFilter';
import storeTypes from 'constants/storeTypes';
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
  const [stockFor, setStockFor] = useState('all');
  const stockIsLoading = useSelector(stockIsLoadingSelector);
  const stock = useSelector(stockStocksSelector);
  const { hasPermission } = useAccess();

  useEffect(() => {
    dispatch(fetchAllStock({ type: stockFor }));
  }, [stockFor]);

  const renderToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <GridToolbarFilterButton />
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ flexGrow: 1 }}>
        <GridDropdownFilter
          label="filter by status"
          options={['all', ...storeTypes.map((store) => store.value)]}
          value={stockFor}
          onChange={(e) => {
            if (e.target.value.length === 0) {
              setStockFor('all');
              return;
            }
            setStockFor(e.target.value);
          }}
        />
      </Box>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        slots={{ toolbar: renderToolbar }}
        slotProps={{
          toolbar: {
            toolbar: renderToolbar,
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
