import FormHelperText from '@mui/material/FormHelperText';

export default function FormHelperTextComponent({ loading = false, error = '', id = '' }) {
  return (
    <FormHelperText id={`"helper-text-${id}`} error={Boolean(error)}>
      {loading ? 'Loading...' : Boolean(error) && error}
    </FormHelperText>
  );
}
