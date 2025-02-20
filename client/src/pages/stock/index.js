import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CButton from 'components/Button';
import MainCard from 'components/MainCard';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import StockTable from './StockTable';
import AddStockForm from './AddStockForm';
import { stockStocksSelector } from 'store/slices/stock/stockSelector';
import StockHistory from './StockHistory';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import ReturnStock from './ReturnStock';

const StockManagement = () => {
  const [addFormModal, setAddFormModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [returnStockModal, setReturnStockModal] = useState(false);
  const [itemId, setItemId] = useState();
  const [itemIdAndType, setItemIdAndType] = useState({});
  const stocks = useSelector(stockStocksSelector);

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
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <CButton
                  text="Manage Damage Items/Materials"
                  onClick={() => {}}
                  Icon={BrokenImageOutlinedIcon}
                  permission={PERMISSIONS.PERMISSION_RECEIVE_STOCK}
                />
              </Grid>
              <Grid item>
                <CButton
                  text="Add Return"
                  onClick={() => setReturnStockModal(true)}
                  Icon={AssignmentReturnOutlinedIcon}
                  permission={PERMISSIONS.PERMISSION_RECEIVE_STOCK}
                />
              </Grid>
              <Grid item>
                <CButton
                  text="Receive Stock"
                  onClick={() => setAddFormModal(true)}
                  Icon={KeyboardBackspaceOutlinedIcon}
                  permission={PERMISSIONS.PERMISSION_RECEIVE_STOCK}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <StockTable showHistory={getItemIdAndType} />
        </MainCard>
      </Grid>
      <AddStockForm item={itemId} visible={addFormModal} onClose={() => setAddFormModal(false)} />
      <StockHistory itemIdAndType={itemIdAndType} visible={historyModal} onClose={() => setHistoryModal(false)} />
      <ReturnStock visible={returnStockModal} onClose={() => setReturnStockModal(false)} />
    </>
  );
};

export default StockManagement;
