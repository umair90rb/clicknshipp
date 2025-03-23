import CustomChipSelect from 'components/CustomChipSelect';
import useStoreLocationFetch from 'hooks/useStoreLocationFetch';
import { useSelector } from 'react-redux';
import { locationIsLoadingSelector, locationListSelector } from 'store/slices/location/locationSelector';

export default function StoreLocationSelectorInput({ value, onChange, onBlur, error, multiple = false }) {
  const locations = useSelector(locationListSelector);
  const locationsIsLoading = useSelector(locationIsLoadingSelector);

  const { refresh } = useStoreLocationFetch();
  return (
    <CustomChipSelect
      fullWidth
      multiple={multiple}
      getLabelFromOptions
      label="Select Store"
      loading={locationsIsLoading}
      withRefresh={refresh}
      error={error}
      value={value}
      name="location_id"
      onChange={onChange}
      onBlur={onBlur}
      options={locations.map(({ id, name }) => ({ value: id, label: name }))}
    />
  );
}
