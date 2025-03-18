import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import FormHelperTextComponent from './FormHelperTextComponent';

export default function CustomRadioGroup({ label = '', name, value, onChange, radios = [], error = '', row = false }) {
  return (
    <FormControl fullWidth margin="normal">
      <FormLabel id={`${name}_group`}>{label}</FormLabel>
      <RadioGroup row={row} aria-labelledby={`${name}_group`} name={name} value={value} onChange={onChange}>
        {radios.map(({ label, value }, i) => (
          <FormControlLabel key={i} value={value} control={<Radio />} label={label} />
        ))}
      </RadioGroup>
      <FormHelperTextComponent id={`${name}_radio_helper_text`} error={error} />
    </FormControl>
  );
}
