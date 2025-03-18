import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import FormHelperTextComponent from './FormHelperTextComponent';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

export default function CustomFileInput({
  label = '',
  name = '',
  onChange = (e) => {},
  error = '',
  disabled = false,
  Icon = CloudUploadOutlinedIcon,
  link = '',
  linkText = 'Download Excel Format'
}) {
  return (
    <Stack spacing={1} sx={{ flexGrow: 1 }}>
      <Button startIcon={<Icon />} sx={{ flexGrow: 1 }} component="label" variant="contained" disabled={disabled}>
        {label || 'Select file (Not Selected)'}
        <VisuallyHiddenInput type="file" name={name} onChange={onChange} />
      </Button>
      {link && (
        <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
          <Link
            target="_blank"
            href="https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=1RwPbZuWD8Xs7vwbvbvITQtuHwPc2_-PZK4miXd2XoXk&exportFormat=xlsx"
          >
            {linkText}
          </Link>
        </Grid>
      )}
      <FormHelperTextComponent id={`${label}_file_helper_text`} error={error} />
    </Stack>
  );
}
