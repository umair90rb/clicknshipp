import { useEffect, useRef, useState } from 'react';
import { Typography, Grid, InputAdornment, OutlinedInput, Chip, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { orderReturnErrorSelector, orderReturnFetchStatusSelector, orderReturnIsLoadingSelector } from 'store/slices/order/orderSelector';
import { fetchReturnOrder } from 'store/slices/order/fetchOrder';
import CircularLoader from 'components/CircularLoader';
import { setMessage } from 'store/slices/util/utilSlice';
import fetchStatus from 'constants/fetchStatuses';
import { setOrderReturnState } from 'store/slices/order/orderSlice';
// import SearchIcon from '@mui/icons-material/Search';
// import CloseIcon from '@mui/icons-material/Close';

export default function ReturnManagement() {
  const dispatch = useDispatch();
  const returnFetchStatus = useSelector(orderReturnFetchStatusSelector);
  const returnIsLoading = useSelector(orderReturnIsLoadingSelector);
  const returnError = useSelector(orderReturnErrorSelector);
  const inputRef = useRef();

  const handleOnChange = (e) => {
    const value = e.target.value;
    if (value.length >= 3) {
      dispatch(fetchReturnOrder({ identifier: value }));
    }
  };

  useEffect(() => {
    if (returnFetchStatus === fetchStatus.FAILURE) {
      dispatch(
        setMessage({
          type: 'error',
          message: returnError?.error || returnError || 'Something goes wrong! try again'
        })
      );
    } else if (returnFetchStatus === fetchStatus.SUCCESS) {
      dispatch(
        setMessage({
          type: 'success',
          message: 'Order return added!'
        })
      );
    }
    dispatch(setOrderReturnState({ fetchStatus: fetchStatus.IDLE, error: null }));
  }, [returnFetchStatus]);

  return (
    <Grid container>
      <Grid item xs={12} mb={2}>
        <Typography variant="h5">Return</Typography>
      </Grid>
      <Grid item xs={12} mb={2}>
        <OutlinedInput
          fullWidth
          autoFocus
          ref={inputRef}
          // startAdornment={
          //   <InputAdornment position="start" sx={{ mr: -0.5 }}>
          //     <SearchIcon fontSize="small" />
          //     {tag && (
          //       <Chip onDelete={handleTagDelete} key={tag} label={tag} sx={{ ml: 0.5, borderRadius: 5 }} size="small" variant="outlined" />
          //     )}
          //   </InputAdornment>
          // }
          endAdornment={<InputAdornment position="end">{returnIsLoading && <CircularLoader />}</InputAdornment>}
          type="text"
          placeholder="Scan parcel or type order CN or Order Number"
          onChange={handleOnChange}
        />
      </Grid>
    </Grid>
  );
}
