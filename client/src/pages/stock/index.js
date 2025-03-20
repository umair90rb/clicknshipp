import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// import CustomButton from 'components/Button';
import MainCard from 'components/MainCard';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import StockTable from './StockTable';
import AddStockForm from './AddStockForm';
import { stockStocksSelector } from 'store/slices/stock/stockSelector';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import AddStockReturn from './AddStockReturn';
import AddStockDamage from './AddStockDamage';
import CustomMenus from 'components/CustomMenu';
import ImportOpeningStockModal from './ImportOpeningStockModal';

const StockManagement = () => {
  const [addFormModal, setAddFormModal] = useState(false);
  const [returnStockModal, setReturnStockModal] = useState(false);
  const [damageStockModal, setDamageStockModal] = useState(false);
  const [showDamageReport, setShowDamageReport] = useState(false);
  const [importOpeningStockModalVisible, setImportOpeningStockModalVisible] = useState(false);
  const [itemId, setItemId] = useState();
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

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Current Stock</Typography>
          </Grid>
          <Grid item>
            <CustomMenus
              options={[
                {
                  title: 'Receive Stock',
                  onClick: () => setAddFormModal(true),
                  Icon: KeyboardBackspaceOutlinedIcon
                },
                {
                  title: 'Receive Return',
                  onClick: () => setReturnStockModal(true),
                  Icon: AssignmentReturnOutlinedIcon
                },
                {
                  title: 'Add Damage Stock',
                  onClick: () => setDamageStockModal(true),
                  Icon: BrokenImageOutlinedIcon
                },
                {
                  title: 'Damage Report',
                  onClick: () => setShowDamageReport(true),
                  Icon: SummarizeOutlinedIcon
                },
                {
                  title: 'Import Opening Stock',
                  onClick: () => setImportOpeningStockModalVisible(true),
                  Icon: FileUploadOutlinedIcon
                }
              ]}
            />
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <StockTable showDamageReport={showDamageReport} setShowDamageReport={setShowDamageReport} />
        </MainCard>
      </Grid>
      <AddStockForm item={itemId} visible={addFormModal} onClose={() => setAddFormModal(false)} />
      <AddStockReturn visible={returnStockModal} onClose={() => setReturnStockModal(false)} />
      <AddStockDamage visible={damageStockModal} onClose={() => setDamageStockModal(false)} />
      <ImportOpeningStockModal visible={importOpeningStockModalVisible} onClose={() => setImportOpeningStockModalVisible(false)} />
    </>
  );
};

export default StockManagement;
