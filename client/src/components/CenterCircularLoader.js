import { CircularProgress, Grid } from '@mui/material';

const CenterCircularLoader = () => (
  <Grid container sx={{ flexGrow: 1 }}>
    <Grid xs display="flex" justifyContent="center" alignItems="center">
      <CircularProgress />
    </Grid>
  </Grid>
);

export default CenterCircularLoader;
