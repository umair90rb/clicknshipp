import Button from '@mui/material/Button';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

export default function GridRefreshButton({ title = 'Refresh', onClick = () => {}, size = 'small' }) {
  return (
    <Button onClick={onClick} size={size} startIcon={<RefreshOutlinedIcon />}>
      {title}
    </Button>
  );
}
