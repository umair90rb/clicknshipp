import { useEffect, useRef, useState } from 'react';
import {
  IconButton,
  Button,
  FormHelperText,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  TextareaAutosize,
  Checkbox,
  FormGroup
} from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import * as Yup from 'yup';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '../../../node_modules/@mui/material/index';
import { toSentence } from 'utils/string-utils';
import CustomDialog from 'components/CustomDialog';
import { fetchAllItem } from 'store/slices/item/fetchItem';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllUnitOfMeasure } from 'store/slices/unitOfMeasure/fetchUnitOfMeasure';
import { fetchAllRawMaterial } from 'store/slices/rawMaterial/fetchRawMaterial';
import { fetchAllLocation } from 'store/slices/location/fetchLocation';
import { itemFetchStatusSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import { rawMaterialFetchStatusSelector, rawMaterialListSelector } from 'store/slices/rawMaterial/RawMaterialSelector';
import { locationFetchStatusSelector, locationListSelector } from 'store/slices/location/locationSelector';
import { unitOfMeasureFetchStatusSelector, unitOfMeasureListSelector } from 'store/slices/unitOfMeasure/unitOfMeasureSelector';
import { fetchAllStock, fetchCreateStockDamage, fetchCreateStockReturn } from 'store/slices/stock/fetchStock';

//duplicate
function filterItemsAndRaw(type, items, raw) {
  if (type === 'finished_product') {
    return items;
  }
  if (type === 'raw_material') {
    return raw.filter((r) => r.type === 'raw_material');
  }
  if (type === 'packaging_material') {
    return raw.filter((r) => r.type === 'packaging_material');
  }
  return [];
}

export default function AddStockDamage({ visible, onClose }) {
  const dispatch = useDispatch();
  const formRef = useRef(null);

  const itemFetchStatus = useSelector(itemFetchStatusSelector);
  const items = useSelector(itemItemsSelector);
  const itemsIsLoading = itemFetchStatus === fetchStatus.REQUEST;

  const rawMaterialFetchStatus = useSelector(rawMaterialFetchStatusSelector);
  const rawMaterials = useSelector(rawMaterialListSelector);
  const rawMaterialIsLoading = rawMaterialFetchStatus === fetchStatus.REQUEST;

  const locationFetchStatus = useSelector(locationFetchStatusSelector);
  const locations = useSelector(locationListSelector);
  const locationIsLoading = locationFetchStatus === fetchStatus.REQUEST;

  const unitsFetchStatus = useSelector(unitOfMeasureFetchStatusSelector);
  const units = useSelector(unitOfMeasureListSelector);
  const unitsIsLoading = unitsFetchStatus === fetchStatus.REQUEST;

  useEffect(() => {
    if (itemFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllItem());
    }
    if (unitsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllUnitOfMeasure());
    }
    if (unitsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllRawMaterial());
    }
    if (locationFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllLocation());
    }
  }, []);

  // duplicate
  function getItemsAndRaw(type = '', items = [], raw = []) {
    const result = filterItemsAndRaw(type, items, raw);
    return result.map((item) => ({
      id: item.id,
      label: item.name,
      unit: item.unit_of_measure
    }));
  }

  const handleSubmit = async (values, { setErrors }) => {
    dispatch(fetchCreateStockDamage({ body: values })).then((action) => {
      if (action.type === 'stockDamage/create/fetch/fulfilled') {
        dispatch(fetchAllStock({ type: 'all' }));
        onClose();
      } else {
        setErrors({ submit: action?.payload?.error || 'Something goes wrong, please try again' });
      }
    });
  };

  return (
    <CustomDialog
      enableBackdrop
      visible={visible}
      onClose={onClose}
      maxWidth="lg"
      dividers={false}
      title="Add Stock Damage"
      actions={[
        <Button key="1" onClick={() => formRef?.current.submitForm()} variant="contained">
          Add Stock Return
        </Button>
      ]}
    >
      <Formik
        innerRef={formRef}
        enableReinitialize
        initialValues={{
          item_type: 'raw_material',
          location_id: null,
          comment: '',
          inventory: [
            {
              item_id: { id: null, label: '' },
              batch_number: '',
              quantity: 0,
              unit_of_measure: '',
              deduct_stock: false
            }
          ]
        }}
        validationSchema={Yup.object().shape({
          item_type: Yup.string().required('Please select inventory type'),
          location_id: Yup.number().required('Please select store location'),
          comment: Yup.string(),
          inventory: Yup.array().of(
            Yup.object().shape({
              item_id: Yup.object().shape({
                id: Yup.string().required(),
                label: Yup.string().required()
              }),
              batch_number: Yup.string(),
              quantity: Yup.number().min(1).required('Please enter stock received quantity'),
              unit_of_measure: Yup.string().required('Please select unit'),
              deduct_stock: Yup.boolean().required()
            })
          )
        })}
        onSubmit={handleSubmit}
      >
        {(addReturnForm) => (
          <Grid container spacing={3}>
            <Grid container columnSpacing={1} alignItems="center" justifyContent="center" item sx={12} md={12} lg={12}>
              <Grid item sx={3} md={3} lg={3}>
                <FormControl fullWidth margin="normal">
                  <FormLabel id="item_type_group">Inventory Type</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="item_type_group"
                    name="item_type"
                    value={addReturnForm.values.item_type}
                    onChange={addReturnForm.handleChange}
                  >
                    <FormControlLabel value="finished_product" control={<Radio />} label="Finished Products" />
                    <FormControlLabel value="raw_material" control={<Radio />} label="Raw Material" />
                    <FormControlLabel value="packaging_material" control={<Radio />} label="Packaging Material" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item container columnSpacing={1} alignItems="center" justifyContent="center" sx={9} md={9} lg={9}>
                <Grid item container columnSpacing={1} alignItems="center" justifyContent="flex-start" sx={12} md={12} lg={12}>
                  <Grid item sx={4} md={4} lg={4}>
                    <FormControl fullWidth margin="normal">
                      <FormLabel id="location_id">Store Location</FormLabel>
                      <Select
                        size="small"
                        labelId="location_id"
                        id="location_id_select"
                        value={addReturnForm.values.location_id}
                        name="location_id"
                        onChange={addReturnForm.handleChange}
                        error={
                          addReturnForm.touched.location_id &&
                          addReturnForm.touched.location_id &&
                          addReturnForm.touched.location_id &&
                          !!addReturnForm.errors.location_id &&
                          !!addReturnForm.errors.location_id &&
                          !!addReturnForm.errors.location_id
                        }
                      >
                        {locations.map(({ id, name }, index) => (
                          <MenuItem key={index} value={id}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                      <ErrorMessage
                        name="location_id"
                        render={(msg) => (
                          <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                            {msg}
                          </FormHelperText>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  {/* 8 col empty */}
                </Grid>
                <Grid item sx={12} md={12} lg={12}>
                  <FormControl fullWidth margin="normal">
                    <FormLabel id="comment">Comment</FormLabel>
                    <TextareaAutosize
                      maxRows={5}
                      minRows={3}
                      size="small"
                      labelId="comment"
                      id="comment_select"
                      value={addReturnForm.values.comment}
                      name="comment"
                      onChange={addReturnForm.handleChange}
                      error={
                        addReturnForm.touched.comment &&
                        addReturnForm.touched.comment &&
                        addReturnForm.touched.comment &&
                        !!addReturnForm.errors.comment &&
                        !!addReturnForm.errors.comment &&
                        !!addReturnForm.errors.comment
                      }
                    />
                    <ErrorMessage
                      name="comment"
                      render={(msg) => (
                        <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                          {msg}
                        </FormHelperText>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sx={12} md={12} lg={12}>
              <FieldArray
                validateOnChange={false}
                name="inventory"
                render={(arrayHelper) =>
                  addReturnForm.values.inventory &&
                  addReturnForm.values.inventory.length > 0 &&
                  addReturnForm.values.inventory.map((item, index) => (
                    <Grid key={index} container spacing={1}>
                      <Grid item xs={2.5}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`inventory.${index}.item_id`}>
                            {addReturnForm.values.item_type === 'finished_product' ? 'Select Product' : 'Select Material'}
                          </FormLabel>
                          <Autocomplete
                            sx={{
                              height: '100%',
                              [`& .${autocompleteClasses.inputRoot}`]: {
                                padding: '0px 0',
                                height: '100%',
                                '& input': {
                                  padding: '0 0px',
                                  height: '100%'
                                }
                              }
                            }}
                            options={getItemsAndRaw(addReturnForm.values.item_type, items, rawMaterials)}
                            error={
                              addReturnForm.touched.inventory &&
                              addReturnForm.touched.inventory[index] &&
                              addReturnForm.touched.inventory[index].item_id &&
                              !!addReturnForm.errors.inventory &&
                              !!addReturnForm.errors.inventory[index] &&
                              !!addReturnForm.errors.inventory[index].item_id
                            }
                            getOptionLabel={(option) => option.label}
                            value={addReturnForm.values.inventory[index].item_id}
                            // onChange={addReturnForm.handleChange}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(e, option) => {
                              addReturnForm.setFieldValue(`inventory.${index}.item_id`, option);
                              addReturnForm.setFieldValue(`inventory.${index}.unit_of_measure`, option.unit);
                            }}
                            type="text"
                            id={`inventory.${index}.item_id`}
                            name={`inventory.${index}.item_id`}
                            autoHighlight
                            renderInput={(params) => (
                              <TextField
                                autoFocus
                                fullWidth
                                id={params.id}
                                size="small"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password' // disable autocomplete and autofill
                                }}
                                {...params.InputProps}
                              />
                            )}
                          />
                          <ErrorMessage
                            name={`inventory.${index}.item_id`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-price">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={2.5}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`inventory.${index}.batch_number`}>Batch Number</FormLabel>
                          <TextField
                            error={
                              addReturnForm.touched.inventory &&
                              addReturnForm.touched.inventory[index] &&
                              addReturnForm.touched.inventory[index].batch_number &&
                              !!addReturnForm.errors.inventory &&
                              !!addReturnForm.errors.inventory[index] &&
                              !!addReturnForm.errors.inventory[index].batch_number
                            }
                            size="small"
                            value={item.batch_number}
                            onChange={addReturnForm.handleChange}
                            type="text"
                            id={`inventory.${index}.batch_number`}
                            name={`inventory.${index}.batch_number`}
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`inventory.${index}.batch_number`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-price">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={2}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`inventory.${index}.quantity`}>Quantity</FormLabel>
                          <TextField
                            error={
                              addReturnForm.touched.inventory &&
                              addReturnForm.touched.inventory[index] &&
                              addReturnForm.touched.inventory[index].quantity &&
                              !!addReturnForm.errors.inventory &&
                              !!addReturnForm.errors.inventory[index] &&
                              !!addReturnForm.errors.inventory[index].quantity
                            }
                            size="small"
                            value={item.quantity}
                            onChange={addReturnForm.handleChange}
                            type="number"
                            id={`inventory.${index}.quantity`}
                            name={`inventory.${index}.quantity`}
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`inventory.${index}.quantity`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-quantity">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={2}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`inventory.${index}.unit_of_measure`}>Unit</FormLabel>
                          <Select
                            size="small"
                            labelId="unit_of_measure"
                            id={`inventory.${index}.unit_of_measure`}
                            value={addReturnForm.values.inventory[index].unit_of_measure}
                            name={`inventory.${index}.unit_of_measure`}
                            onChange={addReturnForm.handleChange}
                            error={
                              addReturnForm.touched.inventory &&
                              addReturnForm.touched.inventory[index] &&
                              addReturnForm.touched.inventory[index].unit_of_measure &&
                              !!addReturnForm.errors.inventory &&
                              !!addReturnForm.errors.inventory[index] &&
                              !!addReturnForm.errors.inventory[index].unit_of_measure
                            }
                          >
                            {units.map(({ id, unit }, index) => (
                              <MenuItem key={index} value={unit}>
                                {unit}
                              </MenuItem>
                            ))}
                          </Select>
                          <ErrorMessage
                            name={`inventory.${index}.unit_of_measure`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={2} alignItems="center" justifyContent="center" display="flex">
                        <FormGroup fullWidth margin="normal">
                          <FormControlLabel
                            id={`inventory.${index}.deduct_stock`}
                            control={
                              <Checkbox
                                size="small"
                                labelId="deduct_stock"
                                id={`inventory.${index}.deduct_stock`}
                                checked={addReturnForm.values.inventory[index].deduct_stock}
                                name={`inventory.${index}.deduct_stock`}
                                onChange={addReturnForm.handleChange}
                              />
                            }
                            label="Deduct Stock"
                          />

                          <ErrorMessage
                            name={`inventory.${index}.deduct_stock`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormGroup>
                      </Grid>

                      <Grid item alignItems="center" justifyContent="center" display="flex" xs={0.5}>
                        <IconButton
                          onClick={() =>
                            arrayHelper.push({
                              item_id: null,
                              batch_number: '',
                              quantity: 0,
                              unit_of_measure: ''
                            })
                          }
                          color="primary"
                          variant="contained"
                        >
                          <AddOutlinedIcon />
                        </IconButton>
                      </Grid>
                      <Grid item alignItems="center" justifyContent="center" display="flex" xs={0.5}>
                        <IconButton
                          onClick={() => addReturnForm.values.inventory.length > 1 && arrayHelper.remove(index)}
                          color="error"
                          variant="outlined"
                        >
                          <CloseOutlinedIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))
                }
              />
            </Grid>
            {addReturnForm.errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{toSentence(addReturnForm.errors.submit)}</FormHelperText>
              </Grid>
            )}
          </Grid>
        )}
      </Formik>
    </CustomDialog>
  );
}
