import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import StockTable from './StockTable';
import AddStockForm from './AddStockForm';
import { useSelector } from 'react-redux';
import { stockStocksSelector } from 'store/slices/stock/stockSelector';
import StockHistory from './StockHistory';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const StockManagement = () => {
  const [addFormModal, setAddFormModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [itemId, setItemId] = useState();
  const [itemIdAndType, setItemIdAndType] = useState({});
  const stocks = useSelector(stockStocksSelector);
  const { hasPermission } = useAccess();

  useEffect(() => {
    if (addFormModal) {
      setAddFormModal(false);
    }
  }, [stocks]);

  useEffect(() => {
    if (!addFormModal) {
      setItemId('');
    }
  }, [addFormModal]);

  const getItemIdAndType = (item_id, item_type) => {
    console.log(item_id, item_type);
    setItemIdAndType({ item_id, item_type });
    setHistoryModal(true);
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Current Stock</Typography>
          </Grid>
          {hasPermission(PERMISSIONS.PERMISSION_RECEIVE_STOCK) && (
            <Grid item>
              <Button variant="contained" startIcon={<KeyboardBackspaceOutlinedIcon />} onClick={() => setAddFormModal(true)}>
                Receive Stock
              </Button>
            </Grid>
          )}
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <StockTable showHistory={getItemIdAndType} />
        </MainCard>
      </Grid>
      <AddStockForm item={itemId} visible={addFormModal} onClose={() => setAddFormModal(false)} />
      <StockHistory itemIdAndType={itemIdAndType} visible={historyModal} onClose={() => setHistoryModal(false)} />
    </>
  );
};

export default StockManagement;
