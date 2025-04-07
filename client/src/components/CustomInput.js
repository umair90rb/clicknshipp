import FormHelperTextComponent from './FormHelperTextComponent';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function CustomInput({
  label = '',
  name = '',
  value = '',
  onChange = (e) => {},
  onBlur = (e) => {},
  type = 'text',
  error = '',
  loading = false
}) {
  console.log(error);
  return (
    <FormControl fullWidth margin="normal">
      {label && <FormLabel id={`${name}_label`}>{label}</FormLabel>}
      <TextField
        size="small"
        labelId={`${name}_label`}
        id={`${name}_id`}
        value={value}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        error={Boolean(error)}
      />
      <FormHelperTextComponent id={`${name}_helper_text`} error={error} loading={loading} />
    </FormControl>
  );
}
