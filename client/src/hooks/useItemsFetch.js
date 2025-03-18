import { useCallback, useEffect } from 'react';
import fetchStatus from 'constants/fetchStatuses';
import { useDispatch, useSelector } from 'react-redux';
import { itemFetchStatusSelector } from 'store/slices/item/itemSelector';
import { fetchAllItem } from 'store/slices/item/fetchItem';

export default function useItemsFetch() {
  const dispatch = useDispatch();
  const itemsFetchStatus = useSelector(itemFetchStatusSelector);
  const fetchItems = useCallback(() => dispatch(fetchAllItem()), []);

  useEffect(() => {
    if (itemsFetchStatus !== fetchStatus.SUCCESS) {
      fetchItems();
    }
  }, []);

  return { refresh: fetchItems };
}
