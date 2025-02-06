import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5)
}));

export default function GridChipFilter({ options = [], onClick, value }) {
  return (
    <List
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none'
      }}
      component="ul"
    >
      {options.map((data, index) => {
        return (
          <ListItem key={index}>
            <Chip
              clickable
              sx={{ borderRadius: 5 }}
              variant={value === data.value ? 'filled' : 'outlined'}
              color={value === data.value ? 'primary' : 'default'}
              size="small"
              label={data.label}
              onClick={() => onClick(data.value)}
            />
          </ListItem>
        );
      })}
    </List>
  );
}
