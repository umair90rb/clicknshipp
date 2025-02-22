import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RestoreIcon from '@mui/icons-material/Restore';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
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
import storeTypes from 'constants/storeTypes';
import GridRefreshButton from 'components/GridRefreshButton';
import GridChipFilter from 'components/GridChipFilter';
import GridSingleChipFilter from 'components/GridSingleChipFilter';
import ItemStockHistory from './StockHistory';
import ItemDamageReport from './ItemDamageReport';
const columns = (showHistory) => [
  {
    field: 'id',
    headerName: 'ID'
  },
  {
    field: 'name',
    headerName: 'Item Name',
    flex: 1,
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
    type: 'actions',
    cellClassName: 'actions',
    getActions: (value) => {
      const actions = [];
      if (showHistory) {
        actions.push(
          <GridActionsCellItem
            key={value.row?.id}
            icon={<RestoreIcon />}
            label="View History"
            className="textPrimary"
            onClick={() => {
              console.log(value.row.item_type);
              showHistory(
                value.row.item_type === 'finished_product' ? value.row.item.id : value.row.raw.id,
                value.row.item_type,
                'stock_history'
              );
            }}
            color="inherit"
          />
        );
      }
      if (showHistory) {
        actions.push(
          <GridActionsCellItem
            key={value.row?.id}
            icon={<BrokenImageOutlinedIcon />}
            label="Damage Report"
            className="textPrimary"
            onClick={() => {
              console.log(value.row.item_type);
              showHistory(
                value.row.item_type === 'finished_product' ? value.row.item.id : value.row.raw.id,
                value.row.item_type,
                'damage_report'
              );
            }}
            color="inherit"
          />
        );
      }
      return actions;
    }
  }
];

export default function StockTable() {
  const dispatch = useDispatch();
  const [stockFor, setStockFor] = useState('all');
  const [lowStock, setLowStock] = useState('false');
  const [historyModal, setHistoryModal] = useState(false);
  const [damageModal, setDamageModal] = useState(false);
  const [itemIdAndType, setItemIdAndType] = useState({});
  const stockIsLoading = useSelector(stockIsLoadingSelector);
  const stock = useSelector(stockStocksSelector);
  const { hasPermission } = useAccess();

  const getItemIdAndType = (item_id, item_type, historyOrDamage) => {
    console.log(item_id, item_type);
    setItemIdAndType({ item_id, item_type });
    if (historyOrDamage === 'stock_history') {
      setHistoryModal(true);
    }
    if (historyOrDamage === 'damage_report') {
      setDamageModal(true);
    }
  };

  useEffect(() => {
    dispatch(fetchAllStock({ type: stockFor, lowStock }));
  }, [stockFor, lowStock]);

  const renderToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <GridToolbarFilterButton />
      <GridRefreshButton onClick={() => dispatch(fetchAllStock({ type: stockFor }))} />
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ flexGrow: 1 }}>
        <GridChipFilter options={[{ label: 'All', value: 'all' }, ...storeTypes]} onClick={setStockFor} value={stockFor} />
        <GridSingleChipFilter label="Low Stock" onClick={setLowStock} value={lowStock} onClickValue="true" resetValue="false" />
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
        columns={columns(hasPermission(PERMISSIONS.PERMISSION_VIEW_STOCK_HISTORY) ? getItemIdAndType : undefined)}
      />
      <ItemStockHistory
        itemIdAndType={itemIdAndType}
        visible={historyModal}
        onClose={() => {
          setHistoryModal(false);
          setItemIdAndType({});
        }}
      />
      <ItemDamageReport
        itemIdAndType={itemIdAndType}
        visible={damageModal}
        onClose={() => {
          setDamageModal(false);
          setItemIdAndType({});
        }}
      />
    </div>
  );
}
