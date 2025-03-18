import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function CustomCheckbox({ label, checked, onChange }) {
  return (
    <FormControl fullWidth margin="normal">
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={onChange} inputProps={{ 'aria-label': 'controlled' }} />}
        label={label}
      />
    </FormControl>
  );
}
