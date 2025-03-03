import Button from '@mui/material/Button';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';

export default function GridFilterButton({ title = 'Filter', onClick = () => {}, Icon = FilterListRoundedIcon, size = 'small' }) {
  return (
    <Button onClick={onClick} size={size} startIcon={<Icon />}>
      {title}
    </Button>
  );
}
