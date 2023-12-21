import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { ArrowLeftOutlined } from '@ant-design/icons';
import StockTable from './StockTable';
import AddStockForm from './AddStockForm';
import { useSelector } from 'react-redux';
import { stockStocksSelector } from 'store/slices/stock/stockSelector';
import StockHistory from './StockHistory';

const addModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

const historyModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

const StockManamgement = () => {
  const [addFormModal, setAddFormModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);

  const [itemId, setItemId] = useState();
  const [stockId, setStockId] = useState();

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

  const receiveStock = (item) => {
    setItemId(item);
    setAddFormModal(true);
  };

  const showHistory = (stockId) => {
    setStockId(stockId);
    setHistoryModal(true);
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Current Inventory</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" startIcon={<ArrowLeftOutlined />} onClick={() => setAddFormModal(true)}>
              Receive Inventory
            </Button>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <StockTable receiveStock={receiveStock} showHistory={showHistory} />
        </MainCard>
      </Grid>
      <Modal
        open={addFormModal}
        onClose={() => setAddFormModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={addModalStyle}>
          <AddStockForm item={itemId} />
        </Box>
      </Modal>
      <Modal
        open={historyModal}
        onClose={() => setHistoryModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={historyModalStyle}>
          <StockHistory id={stockId} />
        </Box>
      </Modal>
    </>
  );
};

export default StockManamgement;
