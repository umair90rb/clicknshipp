import FormHelperText from '@mui/material/FormHelperText';

export default function FormHelperTextComponent({ loading = false, error = false, text = 'Loading...' }) {
  return (
    loading && (
      <FormHelperText error={error} id="helper-text-role-signup">
        {text}
      </FormHelperText>
    )
  );
}
