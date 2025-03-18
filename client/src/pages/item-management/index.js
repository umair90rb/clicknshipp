import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import ItemTable from './ItemTable';
import { useDispatch, useSelector } from 'react-redux';
import { itemItemsSelector } from 'store/slices/item/itemSelector';
import { fetchAllItem, fetchImportItems } from 'store/slices/item/fetchItem';
import { setMessage } from 'store/slices/util/utilSlice';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import CustomFileInput from 'components/CustomFileInput';
import AddItemModal from './AddItemModal';

const ItemsManagement = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const items = useSelector(itemItemsSelector);
  const [importingItems, setImportingItems] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState();
  const { hasPermission } = useAccess();

  const uploadFile = (event) => {
    setImportingItems(true);
    if (event.target.files === '') {
      return;
    }
    let formData = new FormData();
    formData.append('file', event.target.files[0], event.target.value.split(/(\\|\/)/g).pop());

    dispatch(fetchImportItems({ body: formData })).then((action) => {
      if (action.type === 'items/import/fetch/fulfilled') {
        dispatch(fetchAllItem());
        dispatch(setMessage({ message: 'Items imported successfully.', type: 'success' }));
      } else if (action.type === 'items/import/fetch/rejected') {
        dispatch(setMessage({ message: 'Something gose wrong! Items not imported', type: 'error' }));
      }
      event.target.value = '';
      setImportingItems(false);
    });
  };

  const updateItemHandler = (item) => {
    setItemToUpdate(item);
    setOpenModal(true);
  };

  const addItemHandler = () => {
    setItemToUpdate(undefined);
    setOpenModal(true);
  };

  useEffect(() => {
    if (openModal) {
      setOpenModal(false);
    }
  }, [items]);

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Items</Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              {hasPermission(PERMISSIONS.PERMISSION_BULK_CREATE_ITEMS) && (
                <Grid item>
                  <CustomFileInput
                    onChange={uploadFile}
                    label="Import Items"
                    disabled={importingItems}
                    startIcon={importingItems && LoadingOutlined}
                  />
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_ITEM) && (
                <Grid item>
                  <Button variant="contained" startIcon={<PlusOutlined />} onClick={addItemHandler}>
                    Add Item
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ItemTable order="desc" orderBy="id" updateItemHandler={updateItemHandler} />
        </MainCard>
      </Grid>
      <AddItemModal visible={openModal} onClose={() => setOpenModal(false)} item={itemToUpdate} />
    </>
  );
};

export default ItemsManagement;
