import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const IncrementHistoryRow = ({ increment }) => {
  return (
    <Box sx={{ display: 'flex', padding: 1, borderBottom: '1px solid #ddd' }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1">{increment.type}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{increment.amount}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{increment.created_at}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function IncrementHistoryCard({ increments }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Increment Histories
        </Typography>
        <Box sx={{ display: 'flex', padding: 1, backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Type
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Amount
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Added At
              </Typography>
            </Grid>
          </Grid>
        </Box>
        {increments.map((increment, index) => (
          <IncrementHistoryRow key={index} increment={increment} />
        ))}
      </CardContent>
    </Card>
  );
}
