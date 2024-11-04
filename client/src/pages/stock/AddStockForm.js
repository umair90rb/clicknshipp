import { useEffect, useRef } from 'react';
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
  MenuItem
} from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import * as Yup from 'yup';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllItem } from 'store/slices/item/fetchItem';
import { itemFetchStatusSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import fetchStatus from 'constants/fetchStatuses';
import { TextField } from '../../../node_modules/@mui/material/index';
import { fetchAllStock, fetchCreateStock } from 'store/slices/stock/fetchStock';
import { unitOfMeasureFetchStatusSelector, unitOfMeasureListSelector } from 'store/slices/unitOfMeasure/unitOfMeasureSelector';
import { fetchAllUnitOfMeasure } from 'store/slices/unitOfMeasure/fetchUnitOfMeasure';
import { rawMaterialFetchStatusSelector, rawMaterialListSelector } from 'store/slices/rawMaterial/RawMaterialSelector';
import { fetchAllRawMaterial } from 'store/slices/rawMaterial/fetchRawMaterial';
import { toSentence } from 'utils/string-utils';
import { locationFetchStatusSelector, locationListSelector } from 'store/slices/location/locationSelector';
import { fetchAllLocation } from 'store/slices/location/fetchLocation';
import CustomDialog from 'components/CustomDialog';

export default function AddStockForm({ visible, onClose }) {
  const dispatch = useDispatch();
  const formRef = useRef();

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

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    dispatch(fetchCreateStock({ body: values })).then((action) => {
      if (action.type === 'stock/create/fetch/fulfilled') {
        dispatch(fetchAllStock());
        onClose();
      } else {
        setErrors({ submit: action?.payload?.error || 'Something goes wrong, please try again' });
      }
    });
  };

  return (
    <CustomDialog
      visible={visible}
      onClose={onClose}
      maxWidth="lg"
      title="Receive Inventory"
      actions={[
        <Button key="1" onClick={() => formRef?.current.submitForm()} variant="contained">
          Add Stock
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
              production_date: null,
              expiry_date: null,
              quantity: 0,
              unit_of_measure: ''
            }
          ]
        }}
        validationSchema={Yup.object().shape({
          item_type: Yup.string().required('Please select inventory type'),
          comment: Yup.string(),
          location_id: Yup.number().required('Please select store location'),
          inventory: Yup.array().of(
            Yup.object().shape({
              item_id: Yup.object().shape({
                id: Yup.string().required(),
                label: Yup.string().required()
              }),
              batch_number: Yup.string(),
              production_date: Yup.date().nullable(),
              expiry_date: Yup.date().min(new Date(), 'Expiry date must be later than today').nullable(),
              quantity: Yup.number().min(1).required('Please enter stock received quantity'),
              unit_of_measure: Yup.string().required('Please select unit')
            })
          )
        })}
        onSubmit={handleSubmit}
      >
        {(receiveInventory) => (
          <Grid container spacing={3}>
            <Grid container columnSpacing={1} alignItems="center" justifyContent="center" item sx={12} md={12} lg={12}>
              <Grid item sx={3} md={3} lg={3}>
                <FormControl fullWidth margin="normal">
                  <FormLabel id="item_type_group">Inventory Type</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="item_type_group"
                    name="item_type"
                    value={receiveInventory.values.item_type}
                    onChange={receiveInventory.handleChange}
                  >
                    <FormControlLabel value="raw_material" control={<Radio />} label="Raw Material" />
                    <FormControlLabel value="finished_product" control={<Radio />} label="Finished" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item sx={3} md={3} lg={3}>
                <FormControl fullWidth margin="normal">
                  <FormLabel id="location_id">Store Location</FormLabel>
                  <Select
                    size="small"
                    labelId="location_id"
                    id="location_id_select"
                    value={receiveInventory.values.location_id}
                    name="location_id"
                    onChange={receiveInventory.handleChange}
                    error={
                      receiveInventory.touched.location_id &&
                      receiveInventory.touched.location_id &&
                      receiveInventory.touched.location_id &&
                      !!receiveInventory.errors.location_id &&
                      !!receiveInventory.errors.location_id &&
                      !!receiveInventory.errors.location_id
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
              <Grid item sx={6} md={6} lg={6}>
                <FormControl fullWidth margin="normal">
                  <FormLabel id="comment">Comment</FormLabel>
                  <TextField
                    size="small"
                    labelId="comment"
                    id="comment_select"
                    value={receiveInventory.values.comment}
                    name="comment"
                    onChange={receiveInventory.handleChange}
                    error={
                      receiveInventory.touched.comment &&
                      receiveInventory.touched.comment &&
                      receiveInventory.touched.comment &&
                      !!receiveInventory.errors.comment &&
                      !!receiveInventory.errors.comment &&
                      !!receiveInventory.errors.comment
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
            <Grid item sx={12} md={12}>
              <FieldArray
                validateOnChange={false}
                name="inventory"
                render={(arrayHelper) =>
                  receiveInventory.values.inventory &&
                  receiveInventory.values.inventory.length > 0 &&
                  receiveInventory.values.inventory.map((item, index) => (
                    <Grid key={index} container spacing={1}>
                      <Grid item xs={3}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`inventory.${index}.item_id`}>Select Material</FormLabel>
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
                            options={(receiveInventory.values.item_type === 'raw_material' ? rawMaterials : items).map((item) => ({
                              id: item.id,
                              label: item.name
                            }))}
                            error={
                              receiveInventory.touched.inventory &&
                              receiveInventory.touched.inventory[index] &&
                              receiveInventory.touched.inventory[index].item_id &&
                              !!receiveInventory.errors.inventory &&
                              !!receiveInventory.errors.inventory[index] &&
                              !!receiveInventory.errors.inventory[index].item_id
                            }
                            getOptionLabel={(option) => option.label}
                            value={receiveInventory.values.inventory[index].item_id}
                            // onChange={receiveInventory.handleChange}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(e, option) => {
                              receiveInventory.setFieldValue(`inventory.${index}.item_id`, option);
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
                      <Grid item xs={2}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`inventory.${index}.batch_number`}>Batch Number</FormLabel>
                          <TextField
                            error={
                              receiveInventory.touched.inventory &&
                              receiveInventory.touched.inventory[index] &&
                              receiveInventory.touched.inventory[index].batch_number &&
                              !!receiveInventory.errors.inventory &&
                              !!receiveInventory.errors.inventory[index] &&
                              !!receiveInventory.errors.inventory[index].batch_number
                            }
                            size="small"
                            value={item.batch_number}
                            onChange={receiveInventory.handleChange}
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

                      <Grid item xs={1}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`inventory.${index}.quantity`}>Quantity</FormLabel>
                          <TextField
                            error={
                              receiveInventory.touched.inventory &&
                              receiveInventory.touched.inventory[index] &&
                              receiveInventory.touched.inventory[index].quantity &&
                              !!receiveInventory.errors.inventory &&
                              !!receiveInventory.errors.inventory[index] &&
                              !!receiveInventory.errors.inventory[index].quantity
                            }
                            size="small"
                            value={item.quantity}
                            onChange={receiveInventory.handleChange}
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

                      <Grid item xs={1}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`inventory.${index}.unit_of_measure`}>Unit</FormLabel>
                          <Select
                            size="small"
                            labelId="unit_of_measure"
                            id={`inventory.${index}.unit_of_measure`}
                            value={receiveInventory.values.inventory[index].unit_of_measure}
                            name={`inventory.${index}.unit_of_measure`}
                            onChange={receiveInventory.handleChange}
                            error={
                              receiveInventory.touched.inventory &&
                              receiveInventory.touched.inventory[index] &&
                              receiveInventory.touched.inventory[index].unit_of_measure &&
                              !!receiveInventory.errors.inventory &&
                              !!receiveInventory.errors.inventory[index] &&
                              !!receiveInventory.errors.inventory[index].unit_of_measure
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

                      <Grid item xs={2}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`inventory.${index}.expiry_date`}>Expiry Date</FormLabel>
                          <TextField
                            error={
                              receiveInventory.touched.inventory &&
                              receiveInventory.touched.inventory[index] &&
                              receiveInventory.touched.inventory[index].expiry_date &&
                              !!receiveInventory.errors.inventory &&
                              !!receiveInventory.errors.inventory[index] &&
                              !!receiveInventory.errors.inventory[index].expiry_date
                            }
                            size="small"
                            value={item.expiry_date}
                            onChange={receiveInventory.handleChange}
                            type="date"
                            id={`inventory.${index}.expiry_date`}
                            name={`inventory.${index}.expiry_date`}
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`inventory.${index}.expiry_date`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-expiry_date">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={2}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`inventory.${index}.production_date`}>Production Date</FormLabel>
                          <TextField
                            error={
                              receiveInventory.touched.inventory &&
                              receiveInventory.touched.inventory[index] &&
                              receiveInventory.touched.inventory[index].production_date &&
                              !!receiveInventory.errors.inventory &&
                              !!receiveInventory.errors.inventory[index] &&
                              !!receiveInventory.errors.inventory[index].production_date
                            }
                            size="small"
                            value={item.production_date}
                            onChange={receiveInventory.handleChange}
                            type="date"
                            id={`inventory.${index}.production_date`}
                            name={`inventory.${index}.production_date`}
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`inventory.${index}.production_date`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-production_date">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item alignItems="center" justifyContent="center" display="flex" xs={0.5}>
                        <IconButton
                          onClick={() =>
                            arrayHelper.push({
                              item_id: null,
                              batch_number: '',
                              production_date: null,
                              expiry_date: null,
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
                          onClick={() => receiveInventory.values.inventory.length > 1 && arrayHelper.remove(index)}
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
            {receiveInventory.errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{toSentence(receiveInventory.errors.submit)}</FormHelperText>
              </Grid>
            )}
          </Grid>
        )}
      </Formik>
    </CustomDialog>
  );
}
