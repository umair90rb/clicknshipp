import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';

const getWidthHeight = (size) => {
  switch (size) {
    case 'xs':
      return { height: '15vh', width: '15vw' };
    case 'sm':
      return { height: '35vh', width: '35vw' };
    case 'md':
      return { height: '50vh', width: '50vw' };
    case 'lg':
      return { height: '65vh', width: '65vw' };
    case 'xl':
      return { height: '100%', width: '100%' };
    default:
      return { height: '25vh', width: '25vw' };
  }
};

export default function CustomDialog({
  children,
  visible,
  onClose,
  title,
  description,
  actions = [],
  enableBackdrop = false,
  maxWidth,
  fullScreen = false,
  dividers = false,
  scroll = 'paper',
  printable = false
}) {
  return (
    <Dialog
      maxWidth={maxWidth}
      fullScreen={fullScreen}
      open={visible}
      scroll={scroll}
      onClose={(e, reason) => {
        if (enableBackdrop) {
          return onClose();
        } else if (reason !== 'backdropClick') {
          return onClose();
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {title && <Typography variant="h5">{title}</Typography>}
        <Box>
          {printable && (
            <IconButton sx={{ displayPrint: 'none' }} aria-label="print" onClick={window.print}>
              <PrintOutlinedIcon />
            </IconButton>
          )}
          <IconButton sx={{ displayPrint: 'none' }} aria-label="close" onClick={onClose}>
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers={dividers}>
        <div style={getWidthHeight(maxWidth)}>
          {description && <DialogContentText>{description}</DialogContentText>}
          {children}
        </div>
      </DialogContent>
      {actions.length > 0 && <DialogActions sx={{ displayPrint: 'none' }}>{actions}</DialogActions>}
    </Dialog>
  );
}
