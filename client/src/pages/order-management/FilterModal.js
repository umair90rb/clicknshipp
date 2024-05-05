import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Modal,
  Grid,
  Button,
  FormControlLabel,
  FormGroup,
  Container,
  Stack,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useState } from 'react';
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

const OPERATORS = ['contains', 'equals', 'starts with', 'ends with', 'is empty', 'is not empty'];

function OperatorsWithInput({ column, index, addFilterInput, updateColumnFilter }) {
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
              value={column?.filter?.op}
              label="Operators"
              onChange={(e) => updateColumnFilter({ ...column, filter: { ...column?.filter, op: e.target.value } }, index)}
            >
              {OPERATORS.map((o) => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            disabled={column?.filter?.op === OPERATORS[4] || column?.filter?.op === OPERATORS[5]}
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

export default function FilterModal({ visible, onClose, columns, onApplyFilters }) {
  const [columnsWithFilters, setColumnsWithFilters] = useState(columns);

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
}
