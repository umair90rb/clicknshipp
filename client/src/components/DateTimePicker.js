import React from 'react';
import { TextField, Grid } from '@mui/material';
import { dateFormat } from 'constants/index';
import { formatDate } from 'utils/format-date';

const DateTimePicker = ({ startPeriod, endPeriod, onStartDateSelect, onEndDateSelect }) => {
  const handleStartChange = (e) => onStartDateSelect(formatDate(dateFormat, e.target.value));

  const handleEndChange = (e) => onEndDateSelect(formatDate(dateFormat, e.target.value));

  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item xs={6}>
        <TextField
          size="small"
          type="datetime-local"
          label="Start Period"
          value={startPeriod}
          onChange={handleStartChange}
          fullWidth
          InputLabelProps={{
            shrink: true
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          size="small"
          type="datetime-local"
          label="End Period"
          value={endPeriod}
          onChange={handleEndChange}
          fullWidth
          InputLabelProps={{
            shrink: true
          }}
        />
      </Grid>
    </Grid>
  );
};

export default DateTimePicker;
