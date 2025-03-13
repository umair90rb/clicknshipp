import { FormControl, InputBase, Box, Select, MenuItem, Chip } from '@mui/material';

export function GridDropdownFilter({
  label = '',
  options = [],
  value,
  multiple = false,
  onChange = () => {},
  getLabelFromOptions = false
}) {
  return (
    <FormControl sx={{ m: 1 }} size="small">
      <Select
        labelId="filter-select-small-label"
        id="filter-select-small"
        multiple={multiple}
        IconComponent={''}
        displayEmpty
        value={value}
        label={label}
        onChange={onChange}
        input={<InputBase id="select-multiple-chip" label="Chip" />}
        renderValue={(selected) => {
          if (multiple) {
            if (selected?.length === 0) {
              return <Chip size="small" sx={{ borderRadius: 5 }} variant="outlined" key="All" label={label} />;
            }
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected?.map((value) => {
                  if (typeof value === 'object' && 'label' in value) {
                    return <Chip size="small" sx={{ borderRadius: 5 }} variant="outlined" key={value.id} label={value.label} />;
                  }
                  if (getLabelFromOptions) {
                    console.log(value, options);
                    return (
                      <Chip
                        size="small"
                        sx={{ borderRadius: 5 }}
                        variant="outlined"
                        key={value}
                        label={options.find((o) => o.value === value)?.label}
                      />
                    );
                  }
                  return <Chip size="small" sx={{ borderRadius: 5 }} variant="outlined" key={value} label={value} />;
                })}
              </Box>
            );
          }
          if (!selected) {
            return <Chip size="small" sx={{ borderRadius: 5 }} variant="outlined" key="All" label={label} />;
          }
          return <Chip size="small" sx={{ borderRadius: 5 }} variant="outlined" key="All" label={selected} />;
        }}
        // MenuProps={MenuProps}
      >
        {options?.map((option, index) => {
          if (typeof option === 'object' && 'label' in option) {
            return (
              <MenuItem key={index} value={option.value}>
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
