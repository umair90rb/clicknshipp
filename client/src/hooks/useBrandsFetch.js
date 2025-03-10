import fetchStatus from 'constants/fetchStatuses';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { brandFetchStatusSelector } from 'store/slices/brand/brandSelector';
import { fetchAllBrand } from 'store/slices/brand/fetchBrand';

export default function useBrandsFetch() {
  const dispatch = useDispatch();
  const brandsFetchStatus = useSelector(brandFetchStatusSelector);

  useEffect(() => {
    if (brandsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllBrand());
    }
  }, []);
}
