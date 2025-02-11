import * as React from 'react';
import Chip from '@mui/material/Chip';

export default function GridSingleChipFilter({ value, label, onClickValue, resetValue, onClick }) {
  return (
    <Chip
      clickable
      sx={{ borderRadius: 5 }}
      variant={value === onClickValue ? 'filled' : 'outlined'}
      color={value === onClickValue ? 'primary' : 'default'}
      size="small"
      label={label}
      onDelete={value === onClickValue ? () => onClick(resetValue) : undefined}
      onClick={() => onClick(onClickValue)}
    />
  );
}
