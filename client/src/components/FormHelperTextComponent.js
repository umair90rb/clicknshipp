import FormHelperText from '@mui/material/FormHelperText';

export default function FormHelperTextComponent({ loading = false, error = '', id = '' }) {
  return (
    (loading || Boolean(error)) && (
      <FormHelperText id={`"helper-text-${id}`} error={Boolean(error)}>
        {loading ? 'Loading...' : error}
      </FormHelperText>
    )
  );
}
