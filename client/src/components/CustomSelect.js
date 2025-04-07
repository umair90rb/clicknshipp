import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import FormLabel from '@mui/material/FormLabel';
import FormHelperTextComponent from './FormHelperTextComponent';
import InputAdornment from '@mui/material/InputAdornment';
import CustomIconButton from './CustomIconButton';

export default function CustomSelect({
  label = '',
  name = '',
  value = '',
  onChange = (e) => {},
  onBlur = (e) => {},
  options = [],
  multiple = false,
  withAllOption = false,
  withRefresh = undefined,
  loading = false,
  error = ''
}) {
  return (
    <FormControl fullWidth size="small">
      <FormLabel id={`${name}_label`}>{label}</FormLabel>
      <Select
        error={Boolean(error)}
        multiple={multiple}
        labelId={`${label}_label`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        endAdornment={
          withRefresh ? (
            <InputAdornment sx={{ marginRight: 2 }}>
              <CustomIconButton onClick={withRefresh} />
            </InputAdornment>
          ) : null
        }
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
