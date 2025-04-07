import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Badge, Box, ClickAwayListener, IconButton, Paper, Popper, useMediaQuery } from '@mui/material';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import CustomList from 'components/CustomList';
// import CustomIconButton from 'components/CustomIconButton';
import { useSelector } from 'react-redux';
import { notificationCountSelector, notificationListSelector } from 'store/slices/notification/notificationSelector';
import useNotificationsFetch from 'hooks/useNotificationsFetch';
import CustomIconButton from 'components/CustomIconButton';

const Notification = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const notificationCount = useSelector(notificationCountSelector);
  const notifications = useSelector(notificationListSelector);

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = 'grey.300';
  const iconBackColor = 'grey.100';

  const { refresh } = useNotificationsFetch('order', 'export');

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      {/* <CustomIconButton
        component
        onClick={handleToggle}
        ref={anchorRef}
        Icon={
          <Badge badgeContent={4} color="primary">
            <NotificationsOutlinedIcon />
          </Badge>
        }
      /> */}
      <IconButton
        disableRipple
        color="secondary"
        onClick={handleToggle}
        ref={anchorRef}
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
        aria-label="open profile"
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
      >
        <Badge badgeContent={notificationCount} color="primary">
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -5 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 385,
                maxWidth: 520,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 385
                }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={<CustomIconButton onClick={refresh} />}
                >
                  <CustomList items={notifications.map((n) => ({ text: `text`, subText: `sub text`, time: `time` }))} />
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;
