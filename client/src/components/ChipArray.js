import * as React from 'react';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import PropTypes from 'prop-types';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5)
}));

export default function ChipsArray({ data, dataKey }) {
  if (!data || !data.length) {
    return null;
  }

  return (
    <List
      sx={{
        justifyContent: 'center',
        flexWrap: 'wrap',
        display: 'flex',
        listStyle: 'none',
        p: 0.5,
        m: 0,
        shadow: 'none'
      }}
      component="ul"
    >
      {data.map((chip) => (
        <ListItem key={chip.key}>
          <Chip color="primary" variant="outlined" size="small" label={chip[dataKey]} />
        </ListItem>
      ))}
    </List>
  );
}

ChipsArray.propTypes = {
  data: PropTypes.object,
  dataKey: PropTypes.string
};
