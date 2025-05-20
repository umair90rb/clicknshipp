import { useRef } from 'react';
import { Button, MenuItem, Select, FormHelperText, Grid, ListItemText, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { supplierIsLoadingSelector, supplierSuppliersSelector } from 'store/slices/supplier/supplierSelector';
import { categoryCategoriesSelector, categoryIsLoadingSelector } from 'store/slices/category/categorySelector';
import { brandBrandsSelector, brandIsLoadingSelector } from 'store/slices/brand/brandSelector';
import { fetchCreateItem, fetchUpdateItem } from 'store/slices/item/fetchItem';
import { createItem, updateItem } from 'store/slices/item/itemSlice';
import CenterCircularLoader from 'components/CenterCircularLoader';
import { setMessage } from 'store/slices/util/utilSlice';
import { unitOfMeasureIsLoadingSelector, unitOfMeasureListSelector } from 'store/slices/unitOfMeasure/unitOfMeasureSelector';
import useSupplierFetch from 'hooks/useSupplierFetch';
import useBrandsFetch from 'hooks/useBrandsFetch';
import useUOMFetch from 'hooks/useUOMFetch';
import useCategoriesFetch from 'hooks/useCategoriesFetch';
import CustomDialog from 'components/CustomDialog';

export default function AddItemModal({ visible, onClose, item }) {
  const dispatch = useDispatch();
  const formRef = useRef();

  const suppliersIsLoading = useSelector(supplierIsLoadingSelector);
  const suppliers = useSelector(supplierSuppliersSelector);

  const categoriesIsLoading = useSelector(categoryIsLoadingSelector);
  const categories = useSelector(categoryCategoriesSelector);

  const brandsIsLoading = useSelector(brandIsLoadingSelector);
  const brands = useSelector(brandBrandsSelector);

  const unitsIsLoading = useSelector(unitOfMeasureIsLoadingSelector);
  const units = useSelector(unitOfMeasureListSelector);

  useSupplierFetch();
  useBrandsFetch();
  useUOMFetch();
  useCategoriesFetch();

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
    <Formik
      enableReinitialize
      innerRef={formRef}
      initialValues={{
        name: item?.name || '',
        code: item?.code || '',
        unit_price: item?.unit_price || '',
        cost_price: item?.cost_price || '',
        incentive: item?.incentive || '',
        //need to add validation for unit of measure required
        unit_of_measure: item?.unit_of_measure || '',
        supplier: item?.supplier?.id || '',
        category: item?.category?.id || '',
        brand: item?.brand?.id || ''
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required('Name is required'),
        code: Yup.string().max(255).required('Code is required'),
        unit_price: Yup.number().required('Unit price is required'),
        cost_price: Yup.number().required('Cost price is required'),
        incentive: Yup.number(),
        supplier: Yup.number().required('Supplier is required'),
        category: Yup.number().required('Category is required'),
        brand: Yup.number().required('Brand is required')
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <CustomDialog
          actions={[
            {
              text: item ? 'Update Item' : 'Create Item',
              disabled: isSubmitting,
              onClick: handleSubmit
            }
          ]}
          visible={visible}
          onClose={onClose}
          title={item ? 'Update Item' : 'Add Item'}
          maxWidth="md"
        >
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
                  />
                  {touched.code && errors.code && (
                    <FormHelperText error id="helper-text-code-signup">
                      {errors.code}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={6}>
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
                    placeholder="60"
                  />
                  {touched.unit_price && errors.unit_price && (
                    <FormHelperText error id="helper-text-unit_price-signup">
                      {errors.unit_price}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={6}>
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
                    onChange={handleChange}
                    placeholder="50"
                  />
                  {touched.cost_price && errors.cost_price && (
                    <FormHelperText error id="helper-text-cost_price-signup">
                      {errors.cost_price}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="incentive-signup">Incentive</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.incentive && errors.incentive)}
                    id="incentive-signup"
                    type="number"
                    value={values.incentive}
                    name="incentive"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="10"
                  />
                  {touched.incentive && errors.incentive && (
                    <FormHelperText error id="helper-text-incentive-signup">
                      {errors.incentive}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {unitsIsLoading ? (
                <CenterCircularLoader />
              ) : (
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
            </Grid>
          </form>
        </CustomDialog>
      )}
    </Formik>
  );
}
