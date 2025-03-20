import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RestoreIcon from '@mui/icons-material/Restore';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import FilterListOffRoundedIcon from '@mui/icons-material/FilterListOffRounded';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { stockIsLoadingSelector, stockStocksSelector } from 'store/slices/stock/stockSelector';
import { fetchAllStock } from 'store/slices/stock/fetchStock';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import storeTypes from 'constants/storeTypes';
import GridChipFilter from 'components/GridChipFilter';
import ItemStockHistory from './StockHistory';
import ItemDamageReport from './ItemDamageReport';
import GridFilterButton from 'components/GridFilterButton';
import CustomGrid from 'components/CustomGrid';
const columns = (showItemHistory, showItemDamageReport) => [
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
    field: 'item_type',
    headerName: 'Type',
    flex: 0.75,
    valueFormatter: (params) =>
      params.value === 'finished_product' ? 'Item' : params.value === 'raw_material' ? 'Raw Material' : 'Packaging Material'
  },
  {
    field: 'actions',
    headerName: 'Actions',
    type: 'actions',
    cellClassName: 'actions',
    getActions: (value) => {
      const actions = [];
      if (showItemHistory) {
        actions.push(
          <GridActionsCellItem
            key={value.row?.id}
            icon={<RestoreIcon />}
            label="View History"
            className="textPrimary"
            onClick={() => showItemHistory(value.row)}
            color="inherit"
          />
        );
      }
      if (showItemDamageReport) {
        actions.push(
          <GridActionsCellItem
            key={value.row?.id}
            icon={<BrokenImageOutlinedIcon />}
            label="Damage Report"
            className="textPrimary"
            onClick={() => showItemDamageReport(value.row)}
            color="inherit"
          />
        );
      }
      return actions;
    }
  }
];

export default function StockTable({ showDamageReport, setShowDamageReport }) {
  const dispatch = useDispatch();
  const [stockFor, setStockFor] = useState('all');
  const [lowStock, setLowStock] = useState('false');
  const [historyModal, setHistoryModal] = useState(false);
  const [damageModal, setDamageModal] = useState(false);
  const [item, setItem] = useState({});
  const stockIsLoading = useSelector(stockIsLoadingSelector);
  const stock = useSelector(stockStocksSelector);
  const { hasPermission } = useAccess();

  const showItemStockHistory = (item) => {
    setItem(item);
    setHistoryModal(true);
  };

  const showItemDamageReport = (item) => {
    setItem(item);
    setDamageModal(true);
  };

  const lowStockFilterHandler = () => {
    if (lowStock !== 'false') return setLowStock('false');
    const value = parseFloat(prompt('Enter valid low stock number!'));
    if (!isNaN(value)) {
      setLowStock(value);
    }
  };

  const fetchStock = useCallback(() => dispatch(fetchAllStock({ type: stockFor, lowStock })), [stockFor, lowStock]);

  useEffect(() => {
    fetchStock();
  }, [stockFor, lowStock]);

  useEffect(() => {
    console.log(showDamageReport, 'showDamageReportshowDamageReportshowDamageReport');
    if (showDamageReport) {
      setDamageModal(true);
    }
  }, [showDamageReport]);

  const gridCustomActions = useMemo(
    () => (
      <>
        <GridFilterButton
          title="Low Stock"
          onClick={lowStockFilterHandler}
          Icon={lowStock !== 'false' ? FilterListOffRoundedIcon : undefined}
        />
        {hasPermission(PERMISSIONS.PERMISSION_ACCESS_TO_ALL_STORES) && (
          <GridChipFilter options={[{ label: 'All', value: 'all' }, ...storeTypes]} onClick={setStockFor} value={stockFor} />
        )}
      </>
    ),
    [lowStock, stockFor]
  );

  return (
    <div style={{ width: '100%' }}>
      <CustomGrid
        withRefresh={fetchStock}
        allowExport={hasPermission(PERMISSIONS.PERMISSION_EXPORT_STOCK)}
        customActions={gridCustomActions}
        loading={stockIsLoading}
        rows={stock}
        columns={columns(
          hasPermission(PERMISSIONS.PERMISSION_VIEW_STOCK_HISTORY) && showItemStockHistory,
          hasPermission(PERMISSIONS.PERMISSION_GET_ITEM_DAMAGE_REPORT) && showItemDamageReport
        )}
      />
      <ItemStockHistory
        item={item}
        visible={historyModal}
        onClose={() => {
          setHistoryModal(false);
          setItem({});
        }}
      />
      <ItemDamageReport
        item={item}
        visible={damageModal}
        onClose={() => {
          setDamageModal(false);
          setShowDamageReport(false);
          setItem({});
        }}
      />
    </div>
  );
}
