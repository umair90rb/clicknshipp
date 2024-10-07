import PropTypes from 'prop-types';

// material-ui
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const AnalyticEcommerce = ({ color, title, count, percentage, extra }) => {
  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          </Grid>
          {(Boolean(percentage) || percentage === 0) && (
            <Grid item>
              <Chip
                variant="outlined"
                color={percentage < 0 ? 'error' : 'primary'}
                icon={
                  <>
                    {percentage < 0 ? (
                      <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                    ) : (
                      <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />
                    )}
                  </>
                }
                label={`${percentage}%`}
                sx={{ ml: 1.25, pl: 1 }}
                size="small"
              />
            </Grid>
          )}
        </Grid>
      </Stack>
      {extra && (
        <Box sx={{ pt: 2.25 }}>
          <Typography variant="caption" color="textSecondary">
            Compared value is{' '}
            <Typography component="span" variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
              {extra}
            </Typography>
          </Typography>
        </Box>
      )}
    </MainCard>
  );
};

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};

AnalyticEcommerce.defaultProps = {
  color: 'primary'
};

export default AnalyticEcommerce;
