import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

export default function CRadioGroup({ label = '', name, value, onChange, radios = [], row = false }) {
  return (
    <FormControl fullWidth margin="normal">
      <FormLabel id={`${name}_group`}>{label}</FormLabel>
      <RadioGroup row={row} aria-labelledby={`${name}_group`} name={name} value={value} onChange={onChange}>
        {radios.map(({ label, value }, i) => (
          <FormControlLabel key={i} value={value} control={<Radio />} label={label} />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
