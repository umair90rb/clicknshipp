import IconButton from '@mui/material/IconButton';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

export default function CustomIconButton({
  Icon = RefreshOutlinedIcon,
  component = false,
  onClick = () => {},
  size = 'small',
  color = 'primary',
  ...props
}) {
  return (
    <IconButton color={color} onClick={onClick} size={size} {...props}>
      {component ? Icon : <Icon />}
    </IconButton>
  );
}
