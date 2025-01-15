import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Link } from '@mui/material';
import MainCard from 'components/MainCard';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { styled } from '@mui/material/styles';
import RawMaterialTable from './RawMaterialTable';
import AddUpdateRawMaterialForm from './AddUpdateRawMaterialForm';
import { useDispatch, useSelector } from 'react-redux';
import { itemItemsSelector } from 'store/slices/item/itemSelector';
import { setMessage } from 'store/slices/util/utilSlice';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { fetchAllRawMaterial, fetchImportRawMaterial } from 'store/slices/rawMaterial/fetchRawMaterial';

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

export default function RawMaterialManagement() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [rawMaterialType, setRawMaterialType] = useState('');
  const items = useSelector(itemItemsSelector);
  const [importing, setImporting] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState();
  const { hasPermission } = useAccess();

  const uploadFile = (event, type) => {
    setImporting(true);
    if (event.target.files === '') {
      return;
    }
    let formData = new FormData();
    formData.append('file', event.target.files[0], event.target.value.split(/(\\|\/)/g).pop());
    formData.append('type', type);

    dispatch(fetchImportRawMaterial({ body: formData })).then((action) => {
      if (action.type === 'rawMaterial/import/fetch/fulfilled') {
        dispatch(fetchAllRawMaterial());
        dispatch(setMessage({ message: 'Raw materials imported successfully.', type: 'success' }));
      } else if (action.type === 'rawMaterial/import/fetch/rejected') {
        dispatch(setMessage({ message: action.payload.error || 'Something goes wrong! Raw material not imported', type: 'error' }));
      }
      event.target.value = '';
      setImporting(false);
    });
  };

  const updateHandler = (item) => {
    setItemToUpdate(item);
    setOpenModal(true);
  };

  const addRawMaterialHandler = (type) => {
    setItemToUpdate(undefined);
    setRawMaterialType(type);
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
            <Typography variant="h5">Materials</Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              {hasPermission(PERMISSIONS.PERMISSION_BULK_CREATE_ITEMS) && (
                <Grid item>
                  <Button
                    component="label"
                    variant="contained"
                    disabled={importing ? true : undefined}
                    startIcon={importing ? <RefreshOutlinedIcon /> : <CloudUploadOutlinedIcon />}
                  >
                    Import Raw Materials
                    <VisuallyHiddenInput type="file" onChange={(e) => uploadFile(e, 'raw_material')} />
                  </Button>
                  <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                    <Link
                      target="_blank"
                      href="https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=1RwPbZuWD8Xs7vwbvbvITQtuHwPc2_-PZK4miXd2XoXk&exportFormat=xlsx"
                    >
                      Download Excel Format
                    </Link>
                  </Grid>
                </Grid>
              )}

              {hasPermission(PERMISSIONS.PERMISSION_CREATE_ITEM) && (
                <Grid item>
                  <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => addRawMaterialHandler('raw_material')}>
                    Add Raw Material
                  </Button>
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_BULK_CREATE_ITEMS) && (
                <Grid item>
                  <Button
                    component="label"
                    variant="contained"
                    disabled={importing ? true : undefined}
                    startIcon={importing ? <RefreshOutlinedIcon /> : <CloudUploadOutlinedIcon />}
                  >
                    Import Packaging Materials
                    <VisuallyHiddenInput type="file" onChange={(e) => uploadFile(e, 'packaging_material')} />
                  </Button>
                  <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                    <Link
                      target="_blank"
                      href="https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=1RwPbZuWD8Xs7vwbvbvITQtuHwPc2_-PZK4miXd2XoXk&exportFormat=xlsx"
                    >
                      Download Excel Format
                    </Link>
                  </Grid>
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_ITEM) && (
                <Grid item>
                  <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => addRawMaterialHandler('packaging_material')}>
                    Add Packaging Material
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <RawMaterialTable order="desc" orderBy="id" updateHandler={updateHandler} />
        </MainCard>
      </Grid>
      <AddUpdateRawMaterialForm rawMaterial={itemToUpdate} type={rawMaterialType} visible={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
