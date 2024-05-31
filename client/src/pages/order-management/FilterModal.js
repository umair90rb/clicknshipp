import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  FormControlLabel,
  Stack,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { memo, useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { orderFiltersSelector } from 'store/slices/order/orderSelector';
// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4
// };

const OPERATORS = {
  'Is empty': '',
  'Is not empty': '',
  'Text contains': 'text',
  'Text does not contain': 'text',
  'Text starts with': 'text',
  'Text ends with': 'text',
  'Text is exactly': 'text',
  'Date is': 'datetime-local',
  'Date is before': 'datetime-local',
  'Date is after': ':',
  'Greater than': 'number',
  'Greater than or equal to': 'number',
  'Less than': 'number',
  'Less than or equal to': 'number',
  'Is equal to': 'number',
  'Is not equal to': 'number',
  'Is between': 'number',
  'Is not between': 'number'
};

function OperatorsWithInput({ column, index, addFilterInput, updateColumnFilter }) {
  const selectRef = useRef();
  return (
    <>
      <FormControlLabel
        key={index}
        label={column.headerName}
        control={<Checkbox onChange={() => addFilterInput(column, index)} checked={'filter' in column} name={column.headerName} />}
      />
      {'filter' in column && (
        <Grid container direction="row" justifyContent="flex-end" alignItems="center">
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Operator</InputLabel>
            <Select
              inputRef={selectRef}
              value={column?.filter?.op}
              label="Operators"
              onChange={(e) => {
                selectRef.current.value = e.target.value;
                updateColumnFilter({ ...column, filter: { ...column?.filter, op: e.target.value } }, index);
              }}
            >
              {Object.keys(OPERATORS).map((o) => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            disabled={OPERATORS[selectRef.current?.value] === ''}
            type={OPERATORS[selectRef.current?.value || column?.filter?.op]}
            label="Value"
            value={column?.filter?.value}
            onChange={(e) => updateColumnFilter({ ...column, filter: { ...column?.filter, value: e.target.value } }, index)}
            size="small"
          />
        </Grid>
      )}
    </>
  );
}

const FilterModal = memo(({ visible, onClose, columns, onApplyFilters }) => {
  const [columnsWithFilters, setColumnsWithFilters] = useState(columns);
  console.log(columns);
  const addFilterInput = (_column, index) => {
    let column = { ..._column };
    if ('filter' in column) {
      delete column.filter;
    } else {
      column = { ...column, filter: { op: 'contains', value: '' } };
    }
    const _columns = [...columnsWithFilters];
    _columns[index] = column;
    setColumnsWithFilters(_columns);
  };

  const updateColumnFilter = (_column, index) => {
    const _columns = [...columnsWithFilters];
    _columns[index] = _column;
    setColumnsWithFilters(_columns);
  };

  return (
    <>
      <Dialog
        open={visible}
        onClose={onClose}
        PaperProps={{
          sx: {
            minWidth: 400
          }
        }}
        scroll="paper"
      >
        <DialogTitle>Apply filters</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <Stack>
            {columnsWithFilters.map((column, index) => (
              <OperatorsWithInput
                key={index}
                column={column}
                index={index}
                addFilterInput={addFilterInput}
                updateColumnFilter={updateColumnFilter}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button onClick={() => onApplyFilters(columnsWithFilters)} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default FilterModal;
