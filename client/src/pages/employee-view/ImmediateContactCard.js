import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const ContactRow = ({ contact }) => {
  return (
    <Box sx={{ display: 'flex', padding: 1, borderBottom: '1px solid #ddd' }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Typography variant="body1">{contact.name}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{contact.phone}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{contact.address}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{contact.relation}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function ImmediateContactsCard({ contacts }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Immediate Contacts
        </Typography>
        <Box sx={{ display: 'flex', padding: 1, backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Name
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Phone
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Address
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1" fontWeight="bold">
                Relation
              </Typography>
            </Grid>
          </Grid>
        </Box>
        {contacts.map((contact, index) => (
          <ContactRow key={index} contact={contact} />
        ))}
      </CardContent>
    </Card>
  );
}
