import FormHelperTextComponent from './FormHelperTextComponent';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function CustomTextarea({
  name = '',
  label = '',
  value = '',
  onChange = (e) => {},
  onBlur = (e) => {},
  error = '',
  rows = 4,
  maxRows = Infinity,
  minRows = 4,
  placeholder = 'Enter text here...',
  loading = false
}) {
  return (
    <FormControl fullWidth margin="normal">
      {label && <FormLabel id={`${name}_label`}>{label}</FormLabel>}
      <TextareaAutosize
        maxRows={maxRows}
        minRows={minRows}
        rows={rows}
        placeholder={placeholder}
        size="small"
        labelId={`${name}_label`}
        id={`${name}_id`}
        value={value}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        error={Boolean(error)}
      />
      <FormHelperTextComponent id={`${name}_helper_text`} error={error} loading={loading} />
    </FormControl>
  );
}
