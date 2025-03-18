import { InputLabel, Select, FormControl, MenuItem } from '@mui/material';
import FormHelperTextComponent from './FormHelperTextComponent';

export default function CustomSelect({
  label = '',
  name = '',
  value = '',
  onChange = (e) => {},
  onBlur = (e) => {},
  options = [],
  multiple = false,
  withAllOption = false,
  loading = false,
  error = ''
}) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id={`${name}_label`}>{label}</InputLabel>
      <Select
        error={Boolean(error)}
        multiple={multiple}
        labelId={`${label}_label`}
        id={name}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      >
        {[
          ...(withAllOption
            ? [
                {
                  value: options.length === value.length ? '' : 'all',
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
      <FormHelperTextComponent id={name} error={error} loading={loading} />
    </FormControl>
  );
}
