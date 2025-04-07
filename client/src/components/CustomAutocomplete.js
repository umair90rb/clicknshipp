import { FormControl, FormLabel, TextField } from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import FormHelperTextComponent from './FormHelperTextComponent';

export default function CustomAutocomplete({
  label = '',
  name = '',
  options = [],
  value = null,
  onChange = (e, option) => {},
  error = '',
  getOptionLabel = undefined,
  isOptionEqualToValue = undefined,
  loading = false,
  size = 'small'
}) {
  return (
    <FormControl fullWidth margin="normal">
      {label && <FormLabel id={`${name}_label`}>{label}</FormLabel>}
      <Autocomplete
        // multiple need to work on this
        autoHighlight
        autoComplete
        clearOnEscape
        handleHomeEndKeys
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
        options={options}
        error={Boolean(error)}
        getOptionLabel={getOptionLabel}
        value={value}
        isOptionEqualToValue={isOptionEqualToValue}
        onChange={onChange}
        type="text"
        id={`${name}_id`}
        name={name}
        renderInput={(params) => (
          <TextField
            autoFocus
            fullWidth
            id={params.id}
            size={size}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill not worked
              form: {
                autocomplete: 'off'
              }
            }}
            {...params.InputProps}
          />
        )}
      />
      <FormHelperTextComponent error={error} id={`auto-select-helper-text-${name}`} loading={loading} />
    </FormControl>
  );
}
