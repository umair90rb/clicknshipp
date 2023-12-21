import { CircularProgress, Grid } from '@mui/material';

const CenterCircularLoader = () => (
  <Grid container spacing={2} minHeight={500}>
    <Grid xs display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Grid>
  </Grid>
);

export default CenterCircularLoader;
