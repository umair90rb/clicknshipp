import { useRef } from 'react';
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
  TextField
} from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import * as Yup from 'yup';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { itemItemsSelector } from 'store/slices/item/itemSelector';
import { fetchAllStock, fetchCreateStock } from 'store/slices/stock/fetchStock';
import { unitOfMeasureListSelector } from 'store/slices/unitOfMeasure/unitOfMeasureSelector';
import { rawMaterialListSelector } from 'store/slices/rawMaterial/RawMaterialSelector';
import { toSentence } from 'utils/string-utils';
import { locationListSelector } from 'store/slices/location/locationSelector';
import CustomDialog from 'components/CustomDialog';
import { getItemsAndRaw } from './util';
import useStoreLocationFetch from 'hooks/useStoreLocationFetch';
import useItemsFetch from 'hooks/useItemsFetch';
import useUOMFetch from 'hooks/useUOMFetch';
import useRawMaterialsFetch from 'hooks/useRawMaterialsFetch';

export default function AddStockForm({ visible, onClose }) {
  const dispatch = useDispatch();
  const formRef = useRef();

  const items = useSelector(itemItemsSelector);
  const rawMaterials = useSelector(rawMaterialListSelector);
  const locations = useSelector(locationListSelector);
  const units = useSelector(unitOfMeasureListSelector);

  useStoreLocationFetch();
  useItemsFetch();
  useUOMFetch();
  useRawMaterialsFetch();

  const handleSubmit = async (values, { setErrors }) => {
    dispatch(fetchCreateStock({ body: values })).then((action) => {
      if (action.type === 'stock/create/fetch/fulfilled') {
        dispatch(fetchAllStock({ type: 'all' }));
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
      maxWidth="xl"
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
          gate_pass_no: null,
          gate_pass_date: null,
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
          location_id: Yup.number().required('Please select store location'),
          gate_pass_no: Yup.number().nullable().required('Please add gate pass no'),
          gate_pass_date: Yup.date().max(new Date(), 'IGP date must not be later than today').required(),
          comment: Yup.string(),
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
                    <FormControlLabel value="finished_product" control={<Radio />} label="Finished Products" />
                    <FormControlLabel value="raw_material" control={<Radio />} label="Raw Material" />
                    <FormControlLabel value="packaging_material" control={<Radio />} label="Packaging Material" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item container columnSpacing={1} alignItems="center" justifyContent="center" sx={9} md={9} lg={9}>
                <Grid item container columnSpacing={1} alignItems="center" justifyContent="center" sx={12} md={12} lg={12}>
                  <Grid item sx={4} md={4} lg={4}>
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
                  <Grid item sx={4} md={4} lg={4}>
                    <FormControl fullWidth margin="normal">
                      <FormLabel id="gate_pass_no">IGP No</FormLabel>
                      <TextField
                        size="small"
                        labelId="gate_pass_no"
                        id="gate_pass_no_select"
                        value={receiveInventory.values.gate_pass_no}
                        name="gate_pass_no"
                        type="number"
                        onChange={receiveInventory.handleChange}
                        error={
                          receiveInventory.touched.gate_pass_no &&
                          receiveInventory.touched.gate_pass_no &&
                          receiveInventory.touched.gate_pass_no &&
                          !!receiveInventory.errors.gate_pass_no &&
                          !!receiveInventory.errors.gate_pass_no &&
                          !!receiveInventory.errors.gate_pass_no
                        }
                      />
                      <ErrorMessage
                        name="gate_pass_no"
                        render={(msg) => (
                          <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                            {msg}
                          </FormHelperText>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item sx={4} md={4} lg={4}>
                    <FormControl fullWidth margin="normal">
                      <FormLabel id="gate_pass_date">IGP Date</FormLabel>
                      <TextField
                        size="small"
                        labelId="gate_pass_date"
                        id="gate_pass_date_select"
                        value={receiveInventory.values.gate_pass_date}
                        name="gate_pass_date"
                        type="date"
                        onChange={receiveInventory.handleChange}
                        error={
                          receiveInventory.touched.gate_pass_date &&
                          receiveInventory.touched.gate_pass_date &&
                          receiveInventory.touched.gate_pass_date &&
                          !!receiveInventory.errors.gate_pass_date &&
                          !!receiveInventory.errors.gate_pass_date &&
                          !!receiveInventory.errors.gate_pass_date
                        }
                      />
                      <ErrorMessage
                        name="gate_pass_date"
                        render={(msg) => (
                          <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                            {msg}
                          </FormHelperText>
                        )}
                      />
                    </FormControl>
                  </Grid>
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
                          <FormLabel id={`inventory.${index}.item_id`}>
                            {receiveInventory.values.item_type === 'finished_product' ? 'Select Product' : 'Select Material'}
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
                            options={getItemsAndRaw(receiveInventory.values.item_type, items, rawMaterials)}
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
                              receiveInventory.setFieldValue(`inventory.${index}.unit_of_measure`, option.unit);
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
                            name={`inventory.${index}.item_id.id`}
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
