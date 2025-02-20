import Button from '@mui/material/Button';
import useAccess from 'hooks/useAccess';

export default function CButton({ text, onClick, Icon, permission }) {
  const { hasPermission } = useAccess();

  if (permission && hasPermission(permission)) {
    return (
      <Button variant="contained" startIcon={<Icon />} onClick={onClick}>
        {text}
      </Button>
    );
  }
  if (!permission) {
    return (
      <Button variant="contained" startIcon={<Icon />} onClick={onClick}>
        {text}
      </Button>
    );
  }
}
