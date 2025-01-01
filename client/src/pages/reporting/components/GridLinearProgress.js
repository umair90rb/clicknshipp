import styled from '@mui/system/styled';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: '14px',
  width: '88px',
  borderRadius: '7px',
  backgroundColor: ' #ebf5fb',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#2196f3',
    transition: 'none',
    transformOrigin: 'left'
  }
}));

export default function GridLinearProgress({ percentage }) {
  if (isNaN(percentage)) {
    return null;
  }
  return (
    <>
      <BorderLinearProgress color="success" variant="determinate" value={percentage} />
      <Typography variant="h5" color="text.secondary">{`${percentage}%`}</Typography>
    </>
  );
}
