import React from 'react';
import { TextField, Grid } from '@mui/material';
import { dateFormat } from 'constants/index';
import moment from '../../node_modules/moment/moment';

const DateTimePicker = ({ startPeriod, endPeriod, onStartDateSelect, onEndDateSelect }) => {
  const handleStartChange = (e) => onStartDateSelect(moment(e.target.value).format(dateFormat));

  const handleEndChange = (e) => onEndDateSelect(moment(e.target.value).format(dateFormat));

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
