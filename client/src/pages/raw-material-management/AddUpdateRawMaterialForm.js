import { useRef } from 'react';
import { Modal, Box, Button, MenuItem, Select, FormHelperText, Grid, ListItemText, InputLabel, OutlinedInput, Stack } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { supplierIsLoadingSelector, supplierSuppliersSelector } from 'store/slices/supplier/supplierSelector';
// import { categoryCategoriesSelector, categoryFetchStatusSelector, categoryIsLoadingSelector } from 'store/slices/category/categorySelector';
// import { brandBrandsSelector, brandFetchStatusSelector, brandIsLoadingSelector } from 'store/slices/brand/brandSelector';
// import { fetchAllCategory } from 'store/slices/category/fetchCategory';
// import { fetchAllBrand } from 'store/slices/brand/fetchBrand';
import CenterCircularLoader from 'components/CenterCircularLoader';
import { setMessage } from 'store/slices/util/utilSlice';
import { unitOfMeasureIsLoadingSelector, unitOfMeasureListSelector } from 'store/slices/unitOfMeasure/unitOfMeasureSelector';
import { fetchCreateRawMaterial, fetchUpdateRawMaterial } from 'store/slices/rawMaterial/fetchRawMaterial';
import { createRawMaterial, updateRawMaterial } from 'store/slices/rawMaterial/rawMaterialSlice';
import useSupplierFetch from 'hooks/useSupplierFetch';
import useUOMFetch from 'hooks/useUOMFetch';

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

export default function AddUpdateRawMaterial({ rawMaterial, type, visible, onClose }) {
  const dispatch = useDispatch();
  const formRef = useRef();

  const unitsIsLoading = useSelector(unitOfMeasureIsLoadingSelector);
  const units = useSelector(unitOfMeasureListSelector);

  const suppliersIsLoading = useSelector(supplierIsLoadingSelector);
  const suppliers = useSelector(supplierSuppliersSelector);

  // const categoriesIsLoading = useSelector(categoryIsLoadingSelector);
  // const categoriesFetchStatus = useSelector(categoryFetchStatusSelector);
  // const categories = useSelector(categoryCategoriesSelector);

  // const brandsIsLoading = useSelector(brandIsLoadingSelector);
  // const brandsFetchStatus = useSelector(brandFetchStatusSelector);
  // const brands = useSelector(brandBrandsSelector);

  useSupplierFetch();
  useUOMFetch();

  const handleSubmit = async (values, { setErrors }) => {
    if (rawMaterial) {
      return dispatch(fetchUpdateRawMaterial({ id: rawMaterial.id, body: values })).then((action) => {
        if (action.type === 'rawMaterial/update/fetch/fulfilled') {
          dispatch(updateRawMaterial(action.payload.data.rawMaterial));
          dispatch(setMessage({ message: 'Raw material updated successfully.', type: 'success' }));
          onClose();
        } else {
          setErrors({ submit: action.payload.error || 'Something goes wrong, please try again' });
        }
      });
    }
    return dispatch(fetchCreateRawMaterial({ body: values })).then((action) => {
      if (action.type === 'rawMaterial/create/fetch/fulfilled') {
        dispatch(createRawMaterial(action.payload.data.rawMaterial));
        dispatch(setMessage({ message: 'Raw Material created successfully.', type: 'success' }));
        onClose();
      } else {
        setErrors({ submit: action.payload.error || 'Something goes wrong, please try again' });
      }
    });
  };

  // if (categoriesIsLoading || brandsIsLoading || suppliersIsLoading) {
  //   return <CenterCircularLoader />;
  // }

  return (
    <Modal open={visible} onClose={onClose}>
      <Box sx={style}>
        <Formik
          innerRef={formRef}
          initialValues={{
            name: rawMaterial?.name || '',
            description: rawMaterial?.description || '',
            code: rawMaterial?.code || '',
            cost_price: rawMaterial?.cost_price || '',
            re_order_level: rawMaterial?.re_order_level || '',
            unit_of_measure: rawMaterial?.unit_of_measure || '',
            type: rawMaterial?.type || type || 'raw_material',
            supplier: rawMaterial?.supplier?.id || ''
            // category: rawMaterial?.category?.id || '',
            // brand: rawMaterial?.brand?.id || ''
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255).required('Item name is required'),
            description: Yup.string().max(255),
            code: Yup.string().max(255).required('Code is required'),
            unit_of_measure: Yup.string().required('Unit is required'),
            cost_price: Yup.number().required(),
            re_order_level: Yup.number().required(),
            supplier: Yup.number().required()
            // category: Yup.number().required(),
            // brand: Yup.number().required()
          })}
          onSubmit={handleSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="name-signup">Name</InputLabel>
                    <OutlinedInput
                      id="name-login"
                      type="text"
                      value={values.name}
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Flares"
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
                    <InputLabel htmlFor="description-signup">Description</InputLabel>
                    <OutlinedInput
                      id="description-login"
                      type="text"
                      value={values.description}
                      name="description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Flares for package delivery..."
                      fullWidth
                      error={Boolean(touched.description && errors.description)}
                    />
                    {touched.description && errors.description && (
                      <FormHelperText error id="helper-text-description-signup">
                        {errors.description}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="code-signup">Code</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.code && errors.code)}
                      id="code-signup"
                      type="text"
                      value={values.code}
                      name="code"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="FLR-001"
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
                      placeholder="1000"
                    />
                    {touched.cost_price && errors.cost_price && (
                      <FormHelperText error id="helper-text-cost_price-signup">
                        {errors.cost_price}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="re_order_level-signup">Re Order Level</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.re_order_level && errors.re_order_level)}
                      id="re_order_level-signup"
                      type="number"
                      value={values.re_order_level}
                      name="re_order_level"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      placeholder="1000"
                    />
                    {touched.re_order_level && errors.re_order_level && (
                      <FormHelperText error id="helper-text-re_order_level-signup">
                        {errors.re_order_level}
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
                {/* {!categoriesIsLoading && (
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
                )} */}

                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      {rawMaterial ? 'Update Material' : 'Create Material'}
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
