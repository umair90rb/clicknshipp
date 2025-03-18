import Button from '@mui/material/Button';
import useAccess from 'hooks/useAccess';

export default function CustomButton({ text, onClick, Icon, permission, ...rest }) {
  const { hasPermission } = useAccess();

  if (permission && hasPermission(permission)) {
    return (
      <Button variant="contained" startIcon={Icon && <Icon />} onClick={onClick} {...rest}>
        {text}
      </Button>
    );
  }
  if (!permission) {
    return (
      <Button variant="contained" startIcon={Icon && <Icon />} onClick={onClick} {...rest}>
        {text}
      </Button>
    );
  }
}
