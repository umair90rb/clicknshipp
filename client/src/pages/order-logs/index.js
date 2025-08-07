import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import OrderLogsTable from './OrderLogsTable';

const OrderLogs = () => {
  return (
    <>
      <Grid item xs={12} md={12} lg={12}>
        <Grid item>
          <Typography variant="h5">Order Logs</Typography>
        </Grid>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item></Grid>
        </Grid>
        <MainCard>
          <OrderLogsTable />
        </MainCard>
      </Grid>
    </>
  );
};

export default OrderLogs;
