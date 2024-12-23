import { FormControl, InputBase, Select, MenuItem } from '@mui/material';

export function GridMultiDropdownSelect({ options = [], value = [], onChange = () => {} }) {
  return (
    <FormControl sx={{ m: 1 }} size="small">
      <Select
        labelId="filter-select-small-label"
        id="filter-select-small"
        multiple={true}
        IconComponent={''}
        displayEmpty
        value={value}
        onChange={onChange}
        input={<InputBase id="select-multiple-chip" label="Chip" />}
      >
        {options?.map((option, index) => {
          if (typeof option === 'object' && 'label' in option) {
            return (
              <MenuItem key={index} value={option}>
                {option.label}
              </MenuItem>
            );
          }
          return (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
