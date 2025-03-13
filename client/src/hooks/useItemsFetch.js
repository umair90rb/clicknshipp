import { useEffect } from 'react';
import fetchStatus from 'constants/fetchStatuses';
import { useDispatch, useSelector } from 'react-redux';
import { itemFetchStatusSelector } from 'store/slices/item/itemSelector';
import { fetchAllItem } from 'store/slices/item/fetchItem';

export default function useItemsFetch() {
  const dispatch = useDispatch();
  const itemsFetchStatus = useSelector(itemFetchStatusSelector);

  useEffect(() => {
    if (itemsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllItem());
    }
  }, []);
}
