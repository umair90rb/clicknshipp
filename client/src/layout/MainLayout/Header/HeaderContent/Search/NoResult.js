import { Typography, Stack, Box } from '@mui/material';

const NoResult = ({ message }) => {
  return (
    <Box
      height="18vh"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={4}
      p={2}
      sx={{ border: '0px solid grey' }}
    >
      <Typography variant="h5">{message || 'No results found'}</Typography>
    </Box>
  );
};

export default NoResult;
