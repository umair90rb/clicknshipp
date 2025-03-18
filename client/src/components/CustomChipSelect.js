import { InputLabel, Select, Box, Chip, Checkbox, ListItemText, Stack, MenuItem, InputAdornment } from '@mui/material';
import FormHelperTextComponent from './FormHelperTextComponent';
import GridRefreshButton from './GridRefreshButton';
import CustomIconButton from './CustomIconButton';

function getLabel(value, options) {
  if (options && Array.isArray(options) && options.length) {
    return options.find((o) => o.value === value)?.label;
  }
  return '';
}

function startAdornmentWithRefresh(refresh) {
  return {
    startAdornment: refresh
  };
}

export default function CustomChipSelect({
  label = '',
  name = '',
  onChange = (e) => {},
  onBlur = (e) => {},
  options = [],
  getLabelFromOptions = false,
  withRefresh = null,
  inputProps = {},
  fullWidth = false,
  multiple = false,
  value = multiple ? [] : '',
  loading = false,
  disabled = false,
  error = ''
}) {
  return (
    <Stack spacing={1}>
      <InputLabel htmlFor={`${name}_label`} disabled={disabled}>
        {label}
      </InputLabel>
      <Select
        fullWidth={fullWidth}
        multiple={multiple}
        error={Boolean(error)}
        disabled={disabled}
        id={`${name}_id`}
        value={value}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        endAdornment={
          withRefresh ? (
            <InputAdornment position="start" sx={{ marginRight: 2 }}>
              <CustomIconButton onClick={withRefresh} />
            </InputAdornment>
          ) : null
        }
        inputProps={inputProps}
        labelId={`${name}_label`}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                size="small"
                variant="outlined"
                sx={{ borderRadius: 5 }}
                key={value}
                label={getLabelFromOptions ? getLabel(value, options) : value}
              />
            ))}
          </Box>
        )}
      >
        {options.map(({ label, value: ov }, index) => (
          <MenuItem key={index} value={ov}>
            {multiple && <Checkbox checked={value && value.indexOf(ov) > -1} />}
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperTextComponent id={`${name}_helper_id`} loading={loading} error={error} />
    </Stack>
  );
}
