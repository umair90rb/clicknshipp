import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const Unauthorized = () => {
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  };

  const messageStyle = {
    marginBottom: '16px'
  };

  return (
    <Container style={containerStyle}>
      <Typography variant="h3" style={messageStyle}>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" style={messageStyle}>
        {"Sorry, you don't have permission to access this page."}
      </Typography>
    </Container>
  );
};

export default Unauthorized;
