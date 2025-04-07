import { Avatar, Divider, List, ListItemButton, ListItemAvatar, ListItemText, ListItemSecondaryAction, Typography } from '@mui/material';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

function CustomListItem({ text = '', subText = '', time = '', Icon = null, color = 'success' }) {
  return (
    <ListItemButton>
      {Icon && (
        <ListItemAvatar>
          <Avatar
            sx={{
              color: `${color}.main`,
              bgcolor: `${color}.lighter`
            }}
          >
            <Icon />
          </Avatar>
        </ListItemAvatar>
      )}
      <ListItemText primary={<Typography variant="h6">{text}</Typography>} secondary={subText} />
      {time && (
        <ListItemSecondaryAction>
          <Typography variant="caption" noWrap>
            {time}
          </Typography>
        </ListItemSecondaryAction>
      )}
    </ListItemButton>
  );
}

export default function CustomList({ items, divider = true }) {
  return (
    <List
      component="nav"
      sx={{
        p: 0,
        '& .MuiListItemButton-root': {
          py: 0.5,
          '& .MuiAvatar-root': avatarSX,
          '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
        }
      }}
    >
      {Array.isArray(items) &&
        Boolean(items.length) &&
        items.map((item, index) => (
          <>
            <CustomListItem key={index} text={item.text} subText={item.subText} time={item.time} Icon={item.Icon} color={item.color} />
            {divider && <Divider />}
          </>
        ))}
    </List>
  );
}
