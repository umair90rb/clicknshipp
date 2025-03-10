import { FormHelperText, FormControl, FormLabel, TextField } from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { ErrorMessage } from 'formik';

export default function CAutocomplete({
  label = '',
  name = '',
  options = [],
  value = null,
  onChange = (e, option) => {},
  error = false,
  getOptionLabel = undefined,
  isOptionEqualToValue = undefined,
  validate = ''
}) {
  return (
    <FormControl fullWidth margin="normal">
      {label && <FormLabel id={`${name}_label`}>{label}</FormLabel>}
      <Autocomplete
        // multiple need to work on this
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
        error={error}
        getOptionLabel={getOptionLabel}
        value={value}
        isOptionEqualToValue={isOptionEqualToValue}
        onChange={onChange}
        type="text"
        id={`${name}_id`}
        name={name}
        autoHighlight
        renderInput={(params) => (
          <TextField
            autoFocus
            fullWidth
            id={params.id}
            size="small"
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
      {validate && (
        <ErrorMessage
          name={validate}
          render={(msg) => (
            <FormHelperText sx={{ m: 0 }} error={error} id={`helper-text-${name}`}>
              {msg}
            </FormHelperText>
          )}
        />
      )}
    </FormControl>
  );
}
