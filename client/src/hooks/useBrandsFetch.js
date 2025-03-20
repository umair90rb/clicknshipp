import fetchStatus from 'constants/fetchStatuses';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { brandFetchStatusSelector } from 'store/slices/brand/brandSelector';
import { fetchAllBrand } from 'store/slices/brand/fetchBrand';

export default function useBrandsFetch() {
  const dispatch = useDispatch();
  const brandsFetchStatus = useSelector(brandFetchStatusSelector);
  const fetchBrands = useCallback(() => dispatch(fetchAllBrand()), []);

  useEffect(() => {
    if (brandsFetchStatus !== fetchStatus.SUCCESS) {
      fetchBrands();
    }
  }, []);

  return { refresh: fetchBrands };
}
