import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const ExperienceRow = ({ experience }) => {
  return (
    <Box sx={{ display: 'flex', padding: 1, borderBottom: '1px solid #ddd' }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1">{experience.company}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{experience.designation}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{experience.started_at}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{experience.ended_at}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function ExperienceCard({ experiences }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Experience
        </Typography>
        <Box sx={{ display: 'flex', padding: 1, backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Company
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Designation
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
        {experiences.map((experience, index) => (
          <ExperienceRow key={index} experience={experience} />
        ))}
      </CardContent>
    </Card>
  );
}
