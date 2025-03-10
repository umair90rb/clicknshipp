import { InputLabel, Select, FormControl, MenuItem } from '@mui/material';

export default function CSelect({
  label = '',
  name = '',
  value = '',
  onChange = (e) => {},
  options = [],
  multiple = false,
  withAllOption = false
}) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id={`${name}_label`}>{label}</InputLabel>
      <Select multiple={multiple} labelId={`${label}_label`} id={name} label={label} value={value} onChange={onChange}>
        {[
          ...(withAllOption
            ? [
                {
                  value: options.length === value.length ? 'none' : 'all',
                  label: options.length === value.length ? 'Unselect all' : 'Select all'
                }
              ]
            : []),
          ...options
        ].map(({ label, value }, index) => (
          <MenuItem key={index} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
