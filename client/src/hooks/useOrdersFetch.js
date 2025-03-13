import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrder } from 'store/slices/order/fetchOrder';
import { orderFiltersSelector, orderPageSelector, orderPageSizeSelector, orderSortSelector } from 'store/slices/order/orderSelector';

export default function useOrdersFetch() {
  const dispatch = useDispatch();
  const page = useSelector(orderPageSelector);
  const pageSize = useSelector(orderPageSizeSelector);
  const filters = useSelector(orderFiltersSelector);
  const sortModel = useSelector(orderSortSelector);

  const fetchOrders = useCallback(
    () => dispatch(fetchAllOrder({ body: { sort: sortModel, page, pageSize, filters } })),
    [page, pageSize, filters, sortModel]
  );

  useEffect(() => {
    fetchOrders();
  }, [page, pageSize, filters, sortModel]);

  return { refresh: fetchOrders };
}
