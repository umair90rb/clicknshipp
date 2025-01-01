import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9'
  }
}));

export default function HoverDescription({ heading, description, children }) {
  return (
    <HtmlTooltip
      title={
        <>
          <Typography color="inherit">{heading}</Typography>
          {description}
        </>
      }
    >
      <IconButton>{children}</IconButton>
    </HtmlTooltip>
  );
}
