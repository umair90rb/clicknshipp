import IconButton from '@mui/material/IconButton';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

export default function CustomIconButton({ Icon = RefreshOutlinedIcon, onClick = () => {}, size = 'small' }) {
  return (
    <IconButton onClick={onClick} size={size}>
      <Icon />
    </IconButton>
  );
}
