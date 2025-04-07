import Button from '@mui/material/Button';
import useAccess from 'hooks/useAccess';

export default function CustomButton({ text, onClick, Icon, permission, variant = 'contained', size = 'medium', ...rest }) {
  const { hasPermission } = useAccess();

  if (permission && hasPermission(permission)) {
    return (
      <Button variant={variant ? variant : undefined} startIcon={Icon && <Icon />} size={size} onClick={onClick} {...rest}>
        {text}
      </Button>
    );
  }
  if (!permission) {
    return (
      <Button variant={variant ? variant : undefined} startIcon={Icon && <Icon />} onClick={onClick} size={size} {...rest}>
        {text}
      </Button>
    );
  }
}
