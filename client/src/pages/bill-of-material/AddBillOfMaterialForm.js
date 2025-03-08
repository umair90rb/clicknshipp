import { useEffect, useRef } from 'react';
import { IconButton, Button, FormHelperText, Grid, FormControl, FormLabel, Select, MenuItem } from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import * as Yup from 'yup';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllItem } from 'store/slices/item/fetchItem';
import { itemFetchStatusSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import fetchStatus from 'constants/fetchStatuses';
import { TextField } from '@mui/material';
import { unitOfMeasureFetchStatusSelector, unitOfMeasureListSelector } from 'store/slices/unitOfMeasure/unitOfMeasureSelector';
import { fetchAllUnitOfMeasure } from 'store/slices/unitOfMeasure/fetchUnitOfMeasure';
import { rawMaterialFetchStatusSelector, rawMaterialListSelector } from 'store/slices/rawMaterial/RawMaterialSelector';
import { fetchAllRawMaterial } from 'store/slices/rawMaterial/fetchRawMaterial';
import { toSentence } from 'utils/string-utils';
import CustomDialog from 'components/CustomDialog';
import { fetchAllBillOfMaterial, fetchCreateBillOfMaterial } from 'store/slices/billOfMaterial/fetchBillOfMaterial';

export default function AddBillOfMaterialForm({ visible, onClose }) {
  const dispatch = useDispatch();
  const formRef = useRef();

  const itemFetchStatus = useSelector(itemFetchStatusSelector);
  const items = useSelector(itemItemsSelector);
  const itemsIsLoading = itemFetchStatus === fetchStatus.REQUEST;

  const rawMaterialFetchStatus = useSelector(rawMaterialFetchStatusSelector);
  const rawMaterials = useSelector(rawMaterialListSelector);
  const rawMaterialIsLoading = rawMaterialFetchStatus === fetchStatus.REQUEST;

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
  }, []);

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    dispatch(fetchCreateBillOfMaterial({ body: values })).then((action) => {
      if (action.type === 'bom/create/fetch/fulfilled') {
        dispatch(fetchAllBillOfMaterial());
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
      title="Create Bill Of Material"
      dividers
      actions={[
        <Button key="1" onClick={() => formRef?.current.submitForm()} variant="contained">
          Create Bill Of Material
        </Button>
      ]}
    >
      <Formik
        innerRef={formRef}
        enableReinitialize
        initialValues={{
          product_id: { id: null, label: '', type: '' },
          comment: '',
          quantity: 0,
          unit_of_measure: '',
          materials: [
            {
              raw_material_id: { id: null, label: '', type: '' },
              quantity: 0,
              unit_of_measure: ''
            }
          ]
        }}
        validationSchema={Yup.object().shape({
          product_id: Yup.object().shape({
            id: Yup.string().nullable(),
            label: Yup.string().nullable()
          }),
          comment: Yup.string().when('product_id.id', {
            is: (val) => val === '' || val === null,
            then: Yup.string().required('Must enter comment if item not selected'),
            otherwise: Yup.string().optional()
          }),
          quantity: Yup.number().when('product_id.id', {
            is: (val) => val === '' || val === null,
            then: Yup.number().optional(),
            otherwise: Yup.number().min(1).required('Please enter stock received quantity')
          }),
          unit_of_measure: Yup.string().when('product_id.id', {
            is: (val) => val === '' || val === null,
            then: Yup.string().optional(),
            otherwise: Yup.string().required('Please select unit!')
          }),
          materials: Yup.array().of(
            Yup.object().shape({
              raw_material_id: Yup.object().shape({
                id: Yup.string().required('Select raw material'),
                label: Yup.string().required('Select raw material'),
                type: Yup.string().required('Select raw material type')
              }),
              quantity: Yup.number().min(1).required('Please enter stock received quantity'),
              unit_of_measure: Yup.string().required('Please select unit')
            })
          )
        })}
        onSubmit={handleSubmit}
      >
        {(createBillOfMaterial) => (
          <Grid container>
            <Grid container spacing={1} item xs={12}>
              <Grid item xs={4}>
                <FormControl fullWidth margin="normal">
                  <FormLabel id="product_id">Select Item</FormLabel>
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
                    options={items.map((item) => ({
                      id: item.id,
                      label: item.name
                    }))}
                    error={createBillOfMaterial.touched.product_id && !!createBillOfMaterial.errors.product_id}
                    getOptionLabel={(option) => option.label}
                    value={createBillOfMaterial.values.product_id}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    // onChange={createBillOfMaterial.handleChange}
                    onChange={(e, option) => createBillOfMaterial.setFieldValue('product_id', option)}
                    type="text"
                    id="product_id"
                    name="product_id"
                    label="Select Item"
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
                    name="product_id.id"
                    render={(msg) => (
                      <FormHelperText sx={{ m: 0 }} error id="helper-text-price">
                        {msg}
                      </FormHelperText>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth margin="normal">
                  <FormLabel id="comment">Comment</FormLabel>
                  <TextField
                    size="small"
                    labelId="comment"
                    id="comment"
                    value={createBillOfMaterial.values.comment}
                    name="comment"
                    onChange={createBillOfMaterial.handleChange}
                    error={createBillOfMaterial.touched.comment && !!createBillOfMaterial.errors.comment}
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

              <Grid item xs={2}>
                <FormControl fullWidth margin="normal">
                  <FormLabel id="quantity">Quantity</FormLabel>
                  <TextField
                    error={createBillOfMaterial.touched.materials && !!createBillOfMaterial.errors.quantity}
                    size="small"
                    value={createBillOfMaterial.values.quantity}
                    onChange={createBillOfMaterial.handleChange}
                    type="number"
                    id="quantity"
                    name="quantity"
                    variant="outlined"
                  />
                  <ErrorMessage
                    name="quantity"
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
                  <FormLabel id="unit_of_measure">Unit</FormLabel>
                  <Select
                    size="small"
                    labelId="unit_of_measure"
                    id="unit_of_measure_select"
                    value={createBillOfMaterial.values.unit_of_measure}
                    name="unit_of_measure"
                    onChange={createBillOfMaterial.handleChange}
                    error={createBillOfMaterial.touched.unit_of_measure && !!createBillOfMaterial.errors.unit_of_measure}
                  >
                    {units.map(({ id, unit }, index) => (
                      <MenuItem key={index} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                  <ErrorMessage
                    name="unit_of_measure"
                    render={(msg) => (
                      <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                        {msg}
                      </FormHelperText>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FieldArray
                validateOnChange={false}
                name="materials"
                render={(arrayHelper) =>
                  createBillOfMaterial.values.materials &&
                  createBillOfMaterial.values.materials.length > 0 &&
                  createBillOfMaterial.values.materials.map((item, index) => (
                    <Grid key={index} container alignItems="center" spacing={1}>
                      <Grid item xs={6}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`materials.${index}.raw_material_id`}>Select Raw Material</FormLabel>
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
                            options={rawMaterials.map((item) => ({
                              id: item.id,
                              label: item.name,
                              type: item.type
                            }))}
                            error={
                              createBillOfMaterial.touched.materials &&
                              createBillOfMaterial.touched.materials[index] &&
                              createBillOfMaterial.touched.materials[index].raw_material_id &&
                              !!createBillOfMaterial.errors.materials &&
                              !!createBillOfMaterial.errors.materials[index] &&
                              !!createBillOfMaterial.errors.materials[index].raw_material_id
                            }
                            getOptionLabel={(option) => option.label}
                            value={createBillOfMaterial.values.materials[index].raw_material_id}
                            // onChange={createBillOfMaterial.handleChange}
                            onChange={(e, option) => createBillOfMaterial.setFieldValue(`materials.${index}.raw_material_id`, option)}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            type="text"
                            id={`materials.${index}.raw_material_id`}
                            name={`materials.${index}.raw_material_id`}
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
                            name={`materials.${index}.raw_material_id.id`}
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
                          <FormLabel id={`materials.${index}.quantity`}>Quantity</FormLabel>
                          <TextField
                            error={
                              createBillOfMaterial.touched.materials &&
                              createBillOfMaterial.touched.materials[index] &&
                              createBillOfMaterial.touched.materials[index].quantity &&
                              !!createBillOfMaterial.errors.materials &&
                              !!createBillOfMaterial.errors.materials[index] &&
                              !!createBillOfMaterial.errors.materials[index].quantity
                            }
                            size="small"
                            value={item.quantity}
                            onChange={createBillOfMaterial.handleChange}
                            type="number"
                            id={`materials.${index}.quantity`}
                            name={`materials.${index}.quantity`}
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`materials.${index}.quantity`}
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
                          <FormLabel id={`materials.${index}.unit_of_measure`}>Unit</FormLabel>
                          <Select
                            size="small"
                            labelId="unit_of_measure"
                            id="unit_of_measure_select"
                            value={createBillOfMaterial.values.materials[index].unit_of_measure}
                            name={`materials.${index}.unit_of_measure`}
                            onChange={createBillOfMaterial.handleChange}
                            error={
                              createBillOfMaterial.touched.materials &&
                              createBillOfMaterial.touched.materials[index] &&
                              createBillOfMaterial.touched.materials[index].unit_of_measure &&
                              !!createBillOfMaterial.errors.materials &&
                              !!createBillOfMaterial.errors.materials[index] &&
                              !!createBillOfMaterial.errors.materials[index].unit_of_measure
                            }
                          >
                            {units.map(({ id, unit }, index) => (
                              <MenuItem key={index} value={unit}>
                                {unit}
                              </MenuItem>
                            ))}
                          </Select>
                          <ErrorMessage
                            name={`materials.${index}.unit_of_measure`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={0.5}>
                        <IconButton
                          onClick={() =>
                            arrayHelper.push({
                              raw_material_id: { id: null, label: '' },
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
                      <Grid item xs={0.5}>
                        <IconButton
                          onClick={() => createBillOfMaterial.values.materials.length > 1 && arrayHelper.remove(index)}
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
            {createBillOfMaterial.errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{toSentence(createBillOfMaterial.errors.submit)}</FormHelperText>
              </Grid>
            )}
          </Grid>
        )}
      </Formik>
    </CustomDialog>
  );
}
