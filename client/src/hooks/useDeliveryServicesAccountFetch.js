import { useEffect } from 'react';
import fetchStatus from 'constants/fetchStatuses';
import { useDispatch, useSelector } from 'react-redux';
import { deliveryServiceAccountsFetchStatusSelector } from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSelector';
import { fetchDeliveryServiceAccounts } from 'store/slices/deliveryServicesAccounts/fetchDeliveryServicesAccounts';

export default function useDeliveryServicesAccountFetch() {
  const dispatch = useDispatch();
  const deliveryServiceAccountsFetchStatus = useSelector(deliveryServiceAccountsFetchStatusSelector);

  useEffect(() => {
    if (deliveryServiceAccountsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchDeliveryServiceAccounts());
    }
  }, []);
}
