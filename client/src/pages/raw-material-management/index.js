import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Link } from '@mui/material';
import MainCard from 'components/MainCard';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import RawMaterialTable from './RawMaterialTable';
import AddUpdateRawMaterialForm from './AddUpdateRawMaterialForm';
import { useDispatch, useSelector } from 'react-redux';
import { itemItemsSelector } from 'store/slices/item/itemSelector';
import { setMessage } from 'store/slices/util/utilSlice';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { fetchAllRawMaterial, fetchImportRawMaterial } from 'store/slices/rawMaterial/fetchRawMaterial';
import CustomFileInput from 'components/CustomFileInput';
import CustomMenus from 'components/CustomMenu';
import createBlankLink from 'utils/linkGenerator';

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
          {/* <Grid item>
            <CustomMenus
              options={[
                {
                  title: 'Add Raw Material',
                  onClick: () => addRawMaterialHandler('raw_material'),
                  permission: PERMISSIONS.PERMISSION_CREATE_RAW_MATERIAL,
                  Icon: AddOutlinedIcon
                },
                {
                  title: 'Add Packaging Material',
                  onClick: () => addRawMaterialHandler('packaging_material'),
                  permission: PERMISSIONS.PERMISSION_CREATE_RAW_MATERIAL,
                  Icon: AddOutlinedIcon
                },
                {
                  title: 'Import Raw Materials',
                  onClick: (e) => uploadFile(e, 'raw_material'),
                  permission: PERMISSIONS.PERMISSION_BULK_CREATE_RAW_MATERIALS,
                  Icon: CloudUploadOutlinedIcon
                },
                {
                  title: 'Import Packaging Materials',
                  onClick: (e) => uploadFile(e, 'packaging_material'),
                  permission: PERMISSIONS.PERMISSION_BULK_CREATE_RAW_MATERIALS,
                  Icon: CloudUploadOutlinedIcon
                },
                {
                  title: 'Download Import Format',
                  onClick: createBlankLink(
                    'https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=1RwPbZuWD8Xs7vwbvbvITQtuHwPc2_-PZK4miXd2XoXk&exportFormat=xlsx'
                  ),
                  permission: PERMISSIONS.PERMISSION_BULK_CREATE_RAW_MATERIALS,
                  Icon: CloudDownloadOutlinedIcon
                }
              ]}
            />
          </Grid> */}
          <Grid item>
            <Grid container spacing={2}>
              {hasPermission(PERMISSIONS.PERMISSION_BULK_CREATE_RAW_MATERIALS) && (
                <Grid item>
                  <CustomFileInput
                    link="https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=1RwPbZuWD8Xs7vwbvbvITQtuHwPc2_-PZK4miXd2XoXk&exportFormat=xlsx"
                    onChange={(e) => uploadFile(e, 'raw_material')}
                    label="Import Raw Materials"
                    disabled={importing}
                    startIcon={importing && RefreshOutlinedIcon}
                  />
                </Grid>
              )}

              {hasPermission(PERMISSIONS.PERMISSION_CREATE_RAW_MATERIAL) && (
                <Grid item>
                  <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={() => addRawMaterialHandler('raw_material')}>
                    Add Raw Material
                  </Button>
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_BULK_CREATE_RAW_MATERIALS) && (
                <Grid item>
                  <CustomFileInput
                    link="https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=1RwPbZuWD8Xs7vwbvbvITQtuHwPc2_-PZK4miXd2XoXk&exportFormat=xlsx"
                    onChange={(e) => uploadFile(e, 'packaging_material')}
                    label="Import Packaging Materials"
                    disabled={importing}
                    startIcon={importing && RefreshOutlinedIcon}
                  />
                </Grid>
              )}
              {hasPermission(PERMISSIONS.PERMISSION_CREATE_RAW_MATERIAL) && (
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
