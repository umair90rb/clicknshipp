import { useRef } from 'react';
import { TextareaAutosize, IconButton, FormHelperText, Grid, TextField, FormControl, FormLabel, Select, MenuItem } from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import * as Yup from 'yup';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { itemItemsSelector } from 'store/slices/item/itemSelector';
import { toSentence } from 'utils/string-utils';
import CustomDialog from 'components/CustomDialog';
import { fetchCreateSalesOrder } from 'store/slices/salesOrder/fetchSalesOrder';
import { salesOrderCreateCreateModalVisibleSelector } from 'store/slices/salesOrder/salesOrderSelector';
import { setSalesOrderCreateModalVisible } from 'store/slices/salesOrder/salesOrderSlice';
import useItemsFetch from 'hooks/useItemsFetch';
import StoreLocationSelectorInput from 'ui/StoreLocationSelectorInput';
import useResetForm from 'hooks/useResetForm';
import CustomInput from 'components/CustomInput';
import CustomTextarea from 'components/CustomTextarea';
import CustomIconButton from 'components/CustomIconButton';
import CustomAutocomplete from 'components/CustomAutocomplete';
import CustomSelect from 'components/CustomSelect';

export default function AddSalesOrderModal() {
  const dispatch = useDispatch();
  const formRef = useRef();
  const visible = useSelector(salesOrderCreateCreateModalVisibleSelector);
  const items = useSelector(itemItemsSelector);

  useItemsFetch();
  useResetForm(formRef, visible);

  const handleSubmit = (values, _actions) => {
    console.log('values', values);
    dispatch(fetchCreateSalesOrder({ body: values }));
  };

  const onClose = () => {
    dispatch(setSalesOrderCreateModalVisible(false));
  };

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      initialValues={{
        location_id: null,
        name: '',
        comment: '',
        items: [
          {
            item_id: null,
            quantity: 0,
            price: 1
          }
        ]
      }}
      validationSchema={Yup.object().shape({
        location_id: Yup.number().required('Please select store location'),
        name: Yup.string().required(),
        for: Yup.string().required('Please select purpose'),
        comment: Yup.string().when('for', {
          is: (value) => value === 'other',
          then: Yup.string().required('Comment is required when purpose is other')
        }),
        items: Yup.array().of(
          Yup.object().shape({
            item_id: Yup.number().required('Item is required'),
            quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Please enter quantity'),
            price: Yup.number().min(1, 'Price must be at least 1').required('Price is required')
          })
        )
      })}
      onSubmit={handleSubmit}
    >
      {(salesOrder) => (
        <CustomDialog
          visible={visible}
          onClose={onClose}
          maxWidth="xl"
          title="Create New Sale Order"
          actions={[
            {
              text: 'Create and Fulfill',
              onClick: () => {
                console.log('salesOrder', salesOrder.errors);
                salesOrder.handleSubmit();
              }
            }
          ]}
        >
          <Grid container>
            <Grid container columnSpacing={1} alignItems="center" justifyContent="center" item sx={12} md={12} lg={12}>
              <Grid item sx={4} md={4} lg={4}>
                <StoreLocationSelectorInput
                  onBlur={salesOrder.handleBlur}
                  onChange={salesOrder.handleChange}
                  error={salesOrder.touched.location_id && salesOrder.errors.location_id}
                  value={salesOrder.values.location_id}
                />
              </Grid>
              <Grid item sx={4} md={4} lg={4}>
                <CustomInput
                  error={salesOrder.touched.name && salesOrder.errors.name}
                  value={salesOrder.values.name}
                  onChange={salesOrder.handleChange}
                  onBlur={salesOrder.handleBlur}
                  name="name"
                  label="Name"
                />
              </Grid>
              <Grid item sx={4} md={4} lg={4}>
                <CustomSelect
                  error={salesOrder.touched.for && salesOrder.errors.for}
                  value={salesOrder.values.for}
                  onChange={salesOrder.handleChange}
                  onBlur={salesOrder.handleBlur}
                  name="for"
                  label="Select Stock Issue Purpose"
                  options={[
                    { label: 'Today Booking', value: 'today_booking' },
                    { label: 'Sell to Employee', value: 'sell_to_employee' },
                    { label: 'Other', value: 'other' }
                  ]}
                />
              </Grid>
              <Grid item sx={12} md={12} lg={12}>
                <CustomTextarea
                  label="Comment"
                  value={salesOrder.values.comment}
                  onBlur={salesOrder.handleBlur}
                  onChange={salesOrder.handleChange}
                  error={salesOrder.touched.comment && salesOrder.errors.comment}
                  name="comment"
                />
              </Grid>
            </Grid>
            <Grid item sx={12} md={12}>
              <FieldArray
                validateOnChange={false}
                name="items"
                render={(arrayHelper) =>
                  salesOrder.values.items &&
                  salesOrder.values.items.length > 0 &&
                  salesOrder.values.items.map((item, index) => (
                    <Grid key={index} container spacing={1}>
                      <Grid item xs={6}>
                        <CustomAutocomplete
                          label="Select Item"
                          options={items.map((item) => ({
                            id: item.id,
                            label: item.name,
                            price: item.unit_price
                          }))}
                          error={
                            salesOrder.touched.items &&
                            salesOrder.touched.items[index] &&
                            salesOrder.touched.items[index].item_id &&
                            !!salesOrder.errors.items &&
                            !!salesOrder.errors.items[index] &&
                            !!salesOrder.errors.items[index].item_id
                          }
                          value={salesOrder.values.items[index].item_id}
                          isOptionEqualToValue={(option, value) => option.id === value}
                          getOptionLabel={(option) => {
                            if (typeof option === 'number') {
                              return items.find((item) => item.id === option)?.name;
                            }
                            return option.label;
                          }}
                          onChange={(e, option) => {
                            if (option !== null && Object.values(option).length > 0) {
                              salesOrder.setFieldValue(`items.${index}.price`, option.price);
                              salesOrder.setFieldValue(`items.${index}.item_id`, option.id);
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <CustomInput
                          label="Price (for 1 item)"
                          value={item.price}
                          onChange={salesOrder.handleChange}
                          onBlur={salesOrder.handleBlur}
                          name={`items.${index}.price`}
                          error={
                            salesOrder.touched.items &&
                            salesOrder.touched.items[index] &&
                            salesOrder.touched.items[index].price &&
                            !!salesOrder.errors.items &&
                            !!salesOrder.errors.items[index] &&
                            salesOrder.errors.items[index].price
                          }
                          type="number"
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <CustomInput
                          label="Quantity"
                          value={item.quantity}
                          onChange={salesOrder.handleChange}
                          onBlur={salesOrder.handleBlur}
                          name={`items.${index}.quantity`}
                          error={
                            salesOrder.touched.items &&
                            salesOrder.touched.items[index] &&
                            salesOrder.touched.items[index].quantity &&
                            !!salesOrder.errors.items &&
                            !!salesOrder.errors.items[index] &&
                            salesOrder.errors.items[index].quantity
                          }
                          type="number"
                        />
                      </Grid>

                      <Grid item xs={2} alignItems="center" justifyContent="space-evenly" display="flex">
                        <CustomIconButton
                          Icon={AddOutlinedIcon}
                          onClick={() =>
                            arrayHelper.push({
                              item_id: null,
                              quantity: 1,
                              price: 0
                            })
                          }
                        />
                        <CustomIconButton
                          color="error"
                          Icon={CloseOutlinedIcon}
                          onClick={() => salesOrder.values.items.length > 1 && arrayHelper.remove(index)}
                        />
                      </Grid>
                    </Grid>
                  ))
                }
              />
            </Grid>
            {salesOrder.errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{toSentence(salesOrder.errors.submit)}</FormHelperText>
              </Grid>
            )}
          </Grid>
        </CustomDialog>
      )}
    </Formik>
  );
}
