import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const EducationRow = ({ degree }) => {
  return (
    <Box sx={{ display: 'flex', padding: 1, borderBottom: '1px solid #ddd' }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1">{degree.degree}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">
            {degree.obtained}/{degree.total}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{degree.started_at}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{degree.ended_at}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function EducationCard({ education }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Education
        </Typography>
        <Box sx={{ display: 'flex', padding: 1, backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Degree
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Marks
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Started At
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Ended At
              </Typography>
            </Grid>
          </Grid>
        </Box>
        {education.map((degree, index) => (
          <EducationRow key={index} degree={degree} />
        ))}
      </CardContent>
    </Card>
  );
}
