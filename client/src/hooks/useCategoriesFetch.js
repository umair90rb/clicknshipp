import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import fetchStatus from 'constants/fetchStatuses';
import { categoryFetchStatusSelector } from 'store/slices/category/categorySelector';
import { fetchAllCategory } from 'store/slices/category/fetchCategory';

export default function useCategoriesFetch() {
  const dispatch = useDispatch();
  const categoriesFetchStatus = useSelector(categoryFetchStatusSelector);
  const fetchCategories = useCallback(() => dispatch(fetchAllCategory()), []);

  useEffect(() => {
    if (categoriesFetchStatus !== fetchStatus.SUCCESS) {
      fetchCategories();
    }
  }, []);

  return { refresh: fetchCategories };
}
