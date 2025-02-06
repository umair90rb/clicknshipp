import { useEffect, useRef } from 'react';
import { Button, MenuItem, Select, FormHelperText, Grid, ListItemText, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSupplier } from 'store/slices/supplier/fetchSupplier';
import { supplierFetchStatusSelector, supplierIsLoadingSelector, supplierSuppliersSelector } from 'store/slices/supplier/supplierSelector';
import { categoryCategoriesSelector, categoryFetchStatusSelector, categoryIsLoadingSelector } from 'store/slices/category/categorySelector';
import { brandBrandsSelector, brandFetchStatusSelector, brandIsLoadingSelector } from 'store/slices/brand/brandSelector';
import { fetchAllCategory } from 'store/slices/category/fetchCategory';
import { fetchAllBrand } from 'store/slices/brand/fetchBrand';
import { fetchCreateItem, fetchUpdateItem } from 'store/slices/item/fetchItem';
import { createItem, updateItem } from 'store/slices/item/itemSlice';
import CenterCircularLoader from 'components/CenterCircularLoader';
import { setMessage } from 'store/slices/util/utilSlice';
import fetchStatus from 'constants/fetchStatuses';
import {
  unitOfMeasureFetchStatusSelector,
  unitOfMeasureIsLoadingSelector,
  unitOfMeasureListSelector
} from 'store/slices/unitOfMeasure/unitOfMeasureSelector';
import { fetchAllUnitOfMeasure } from 'store/slices/unitOfMeasure/fetchUnitOfMeasure';

// ============================|| FIREBASE - REGISTER ||============================ //

const AddItemForm = ({ item }) => {
  const dispatch = useDispatch();
  const formRef = useRef();

  const suppliersIsLoading = useSelector(supplierIsLoadingSelector);
  const suppliersFetchStatus = useSelector(supplierFetchStatusSelector);
  const suppliers = useSelector(supplierSuppliersSelector);

  const categoriesIsLoading = useSelector(categoryIsLoadingSelector);
  const categoriesFetchStatus = useSelector(categoryFetchStatusSelector);
  const categories = useSelector(categoryCategoriesSelector);

  const brandsIsLoading = useSelector(brandIsLoadingSelector);
  const brandsFetchStatus = useSelector(brandFetchStatusSelector);
  const brands = useSelector(brandBrandsSelector);

  const unitsIsLoading = useSelector(unitOfMeasureIsLoadingSelector);
  const unitsFetchStatus = useSelector(unitOfMeasureFetchStatusSelector);
  const units = useSelector(unitOfMeasureListSelector);

  useEffect(function () {
    if (suppliersFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllSupplier());
    }
    if (categoriesFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllCategory());
    }
    if (brandsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllBrand());
    }
    if (unitsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllUnitOfMeasure());
    }
  }, []);

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    if (item) {
      return dispatch(fetchUpdateItem({ id: item.id, body: values })).then((action) => {
        if (action.type === 'item/update/fetch/fulfilled') {
          dispatch(updateItem(action.payload.data.item));
          dispatch(setMessage({ message: 'Item updated successfully.', type: 'success' }));
        } else {
          setErrors({ submit: action.payload.error || 'Something goes wrong, please try again' });
        }
      });
    }
    return dispatch(fetchCreateItem({ body: values })).then((action) => {
      if (action.type === 'item/create/fetch/fulfilled') {
        dispatch(createItem(action.payload.data.item));
        dispatch(setMessage({ message: 'Item created successfully.', type: 'success' }));
      } else {
        setErrors({ submit: action.payload.error || 'Something goes wrong, please try again' });
      }
    });
  };

  if (categoriesIsLoading || brandsIsLoading || suppliersIsLoading) {
    return <CenterCircularLoader />;
  }

  return (
    <>
      <Formik
        innerRef={formRef}
        initialValues={{
          name: item?.name || '',
          code: item?.code || '',
          unit_price: item?.unit_price || '',
          cost_price: item?.cost_price || '',
          unit_of_measure: item?.unit_of_measure || '',
          supplier: item?.supplier?.id || '',
          category: item?.category?.id || '',
          brand: item?.brand?.id || ''
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Item name is required'),
          code: Yup.string().max(255).required('Code is required'),
          unit_price: Yup.number().required('Unit price is required'),
          cost_price: Yup.number().required(),
          supplier: Yup.number().required(),
          category: Yup.number().required(),
          brand: Yup.number().required()
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name-signup">Item Name</InputLabel>
                  <OutlinedInput
                    id="name-login"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Join On Plus"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error id="helper-text-name-signup">
                      {errors.name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="code-signup">code</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.code && errors.code)}
                    id="code-signup"
                    type="text"
                    value={values.code}
                    name="code"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="008555678"
                    inputProps={{}}
                  />
                  {touched.code && errors.code && (
                    <FormHelperText error id="helper-text-code-signup">
                      {errors.code}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="unit_price-signup">Unit Price</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.unit_price && errors.unit_price)}
                    id="unit_price-login"
                    type="number"
                    value={values.unit_price}
                    name="unit_price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="120"
                    inputProps={{}}
                  />
                  {touched.unit_price && errors.unit_price && (
                    <FormHelperText error id="helper-text-unit_price-signup">
                      {errors.unit_price}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="cost_price-signup">Cost Price</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.cost_price && errors.cost_price)}
                    id="cost_price-signup"
                    type="number"
                    value={values.cost_price}
                    name="cost_price"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    placeholder="ABC Inc"
                  />
                  {touched.cost_price && errors.cost_price && (
                    <FormHelperText error id="helper-text-cost_price-signup">
                      {errors.cost_price}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {unitsIsLoading ? (
                <CenterCircularLoader />
              ) : (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="unit_of_measure-signup">Unit of Measure</InputLabel>
                    <Select
                      fullWidth
                      error={Boolean(touched.unit_of_measure && errors.unit_of_measure)}
                      id="unit_of_measure-signup"
                      value={values.unit_of_measure}
                      name="unit_of_measure"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      labelId="unit_of_measure-signup"
                    >
                      {units.map(({ id, unit }) => (
                        <MenuItem key={id} value={unit}>
                          <ListItemText primary={unit} />
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.unit_of_measure && errors.unit_of_measure && (
                      <FormHelperText error id="helper-text-unit_of_measure-signup">
                        {errors.unit_of_measure}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              )}
              {!categoriesIsLoading && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="category-signup">Category</InputLabel>
                    <Select
                      fullWidth
                      error={Boolean(touched.category && errors.category)}
                      id="category-signup"
                      value={values.category}
                      name="category"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      inputProps={{}}
                      labelId="category-signup"
                    >
                      {categories.map(({ id, name }, index) => (
                        <MenuItem key={index} value={id}>
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.category && errors.category && (
                      <FormHelperText error id="helper-text-category-signup">
                        {errors.category}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              )}
              {!brandsIsLoading && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="brand-signup">Brand</InputLabel>
                    <Select
                      fullWidth
                      error={Boolean(touched.brand && errors.brand)}
                      id="brand-signup"
                      value={values.brand}
                      name="brand"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      inputProps={{}}
                      labelId="brand-signup"
                    >
                      {brands.map(({ id, name }, index) => (
                        <MenuItem key={index} value={id}>
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.brand && errors.brand && (
                      <FormHelperText error id="helper-text-brand-signup">
                        {errors.brand}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              )}
              {!suppliersIsLoading && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="supplier-signup">Suppliers</InputLabel>
                    <Select
                      fullWidth
                      error={Boolean(touched.supplier && errors.supplier)}
                      id="supplier-signup"
                      value={values.supplier}
                      name="supplier"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      inputProps={{}}
                      labelId="supplier-signup"
                    >
                      {suppliers.map(({ id, name }, index) => (
                        <MenuItem key={index} value={id}>
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.supplier && errors.supplier && (
                      <FormHelperText error id="helper-text-supplier-signup">
                        {errors.supplier}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              )}
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {item ? 'Update Item' : 'Create Item'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddItemForm;
