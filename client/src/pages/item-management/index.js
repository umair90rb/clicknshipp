import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Modal, Box } from '@mui/material';
import MainCard from 'components/MainCard';
import { PlusOutlined, FileExcelOutlined, LoadingOutlined } from '@ant-design/icons';
import { styled } from '@mui/material/styles';
import ItemTable from './ItemTable';
import AddItemForm from './AddItemForm';
import { useDispatch, useSelector } from 'react-redux';
import { itemItemsSelector } from 'store/slices/item/itemSelector';
import { fetchAllItem, fetchImportItems } from 'store/slices/item/fetchItem';
import { setMessage } from 'store/slices/util/utilSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

const ItemsManagement = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const items = useSelector(itemItemsSelector);
  const [importingItems, setImportingItems] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState();

  const uploadFile = (event) => {
    setImportingItems(true);
    console.log(event.target.files, 'event.target.files');
    if (event.target.files === '') {
      return;
    }
    let formData = new FormData();
    formData.append('file', event.target.files[0], event.target.value.split(/(\\|\/)/g).pop());

    dispatch(fetchImportItems({ body: formData })).then((action) => {
      console.log(action);
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
            <Typography variant="h5">Items List</Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  component="label"
                  variant="contained"
                  disabled={importingItems ? true : undefined}
                  startIcon={importingItems ? <LoadingOutlined /> : <FileExcelOutlined />}
                >
                  Add Bulk Item
                  <VisuallyHiddenInput type="file" onChange={uploadFile} />
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" startIcon={<PlusOutlined />} onClick={addItemHandler}>
                  Add Item
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ItemTable order="desc" orderBy="id" updateItemHandler={updateItemHandler} />
        </MainCard>
      </Grid>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddItemForm item={itemToUpdate} />
        </Box>
      </Modal>
    </>
  );
};

export default ItemsManagement;
