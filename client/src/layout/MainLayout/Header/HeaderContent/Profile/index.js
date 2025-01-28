import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  Divider,
  Paper,
  Popper,
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import LogoutIcon from '@mui/icons-material/Logout';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import { authBrandsSelector, authSettingsSelector, authUserSelector } from 'store/slices/auth/authSelector';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthState, setAuthUpdatePasswordVisible, setAuthUserSetting } from 'store/slices/auth/authSlice';
import useAuth from 'hooks/useAuth';
import { fetchSetUserDefaultBrand } from 'store/slices/user/fetchUser';
import { setMessage } from 'store/slices/util/utilSlice';
import { fetchAllOrder } from 'store/slices/order/fetchOrder';
import { clearOrderState } from 'store/slices/order/orderSlice';

const ListItem = ({ text, selected, onClick, icon }) => (
  <ListItemButton selected={selected} onClick={onClick}>
    {icon && <ListItemIcon>{icon}</ListItemIcon>}
    <ListItemText primary={text} />
  </ListItemButton>
);

const Profile = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const user = useSelector(authUserSelector);
  // const userBrands = useSelector(authBrandsSelector);
  // const userSetting = useSelector(authSettingsSelector);

  const handleUpdatePassword = () => {
    setOpen(false);
    dispatch(setAuthUpdatePasswordVisible(true));
  };

  const handleLogout = async () => {
    dispatch(clearAuthState());
    dispatch(clearOrderState());
    logout();
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  // const [value, setValue] = useState(0);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  // const handlBrandChange = async (event, brand) => {
  //   const { type, payload } = await dispatch(fetchSetUserDefaultBrand({ id: brand.id }));
  //   if (type === 'user/setDefaultBrand/fetch/fulfilled') {
  //     dispatch(setAuthUserSetting(payload.data.settings));
  //     dispatch(fetchAllOrder({ body: {} }));
  //   } else {
  //     dispatch(setMessage({ message: payload.error || 'Brand not switch! try again.', type: 'error' }));
  //   }
  // };

  const iconBackColorOpen = 'grey.300';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar alt="profile user" sx={{ width: 32, height: 32 }}>
            {user?.name[0].toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1">{user?.name}</Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
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
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250
                  }
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar alt="profile user" sx={{ width: 32, height: 32 }}>
                              {user?.name[0].toUpperCase()}
                            </Avatar>
                            <Stack>
                              <Typography variant="h6">{user?.name}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {user?.email}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
                      {/* {userBrands?.map((brand, index) => (
                        <ListItem
                          selected={brand.id === userSetting?.default_brand_id || (!userSetting?.default_brand_id && index === 0)}
                          key={brand.id}
                          text={brand.name.toUpperCase()}
                          onClick={(event) => handlBrandChange(event, brand)}
                        />
                      ))} */}
                      <Divider />
                      <ListItem text="Update Password" onClick={handleUpdatePassword} icon={<PasswordOutlinedIcon />} />
                      <Divider />
                      <ListItem text="Logout" onClick={handleLogout} icon={<LogoutIcon />} />
                    </List>
                    {/* {open && (
                      <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize'
                              }}
                              icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Profile"
                              {...a11yProps(0)}
                            />
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize'
                              }}
                              icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Setting"
                              {...a11yProps(1)}
                            />
                          </Tabs>
                        </Box>
                        <TabPanel value={value} index={0} dir={theme.direction}>
                          <ProfileTab handleLogout={handleLogout} />
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                          <SettingTab />
                        </TabPanel>
                      </>
                    )} */}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
