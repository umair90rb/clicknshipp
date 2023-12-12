import formatDate from 'utils/format-date';
import { Grid, Stack, Typography, Card, CardContent } from '../../../node_modules/@mui/material/index';

const Item = () => (
  <>
    <Typography variant="body1">Item Name Rs 100 * 12 1200</Typography>
  </>
);

const OrderView = () => {
  return (
    <Stack>
      <Typography variant="h4">#1009</Typography>
      <Typography color="grey" variant="subtitle2">
        {formatDate() + ' from Testing'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent></CardContent>
          </Card>

          <Card sx={{ minWidth: 275, mt: 1 }}>
            <CardContent></CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} gutterBottom>
                Note
              </Typography>
              <Typography paragraph>Here will be the note</Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 275, mt: 1 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Customer
              </Typography>
              <Typography gutterBottom>Customer full name</Typography>
              <Typography variant="h5" gutterBottom>
                Contact information
              </Typography>
              <Typography>email@example.com</Typography>
              <Typography>030098483232</Typography>

              <Typography variant="h5" gutterBottom>
                Shipping Address
              </Typography>
              <Typography>
                P 927 Street 10 F Block Gulistan Colony 1 <br /> Faisalabad 38000 <br /> Pakistan
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default OrderView;
