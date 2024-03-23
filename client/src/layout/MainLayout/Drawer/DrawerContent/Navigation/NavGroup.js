import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// material-ui
import { Box, List, Typography } from '@mui/material';

// project import
import NavItem from './NavItem';
import useAccess from 'hooks/useAccess';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
  const menu = useSelector((state) => state.menu);
  const { hasPermission } = useAccess();
  const { drawerOpen } = menu;
  const navCollapse = [];
  item.children?.forEach((menuItem) => {
    if (menuItem.type === 'item') {
      if (menuItem.permission === undefined) {
        navCollapse.push(<NavItem key={menuItem.id} item={menuItem} level={1} />);
      } else if (hasPermission(menuItem.permission)) {
        navCollapse.push(<NavItem key={menuItem.id} item={menuItem} level={1} />);
      }
    }
  });

  if (!navCollapse.length) {
    return null;
  }

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object
};

export default NavGroup;
