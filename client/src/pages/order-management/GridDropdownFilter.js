import { FormControl, Button, InputBase, Box, Select, MenuItem, Chip } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 20
    }
  }
};

export function GridDropdownFilter({ label = '', options = [], value, multiple = false, onChange = () => {} }) {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      {/* <InputLabel id="filter-select-small-label">{label}</InputLabel> */}
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
            if (selected.length === 0) {
              return <Chip size="small" sx={{ borderRadius: 5 }} variant="outlined" key="All" label="All" />;
            }
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip size="small" sx={{ borderRadius: 5 }} variant="outlined" key={value} label={value} />
                ))}
              </Box>
            );
          }
          if (!selected) {
            return <Chip size="small" sx={{ borderRadius: 5 }} variant="outlined" key="All" label="All" />;
          }
          return <Chip size="small" sx={{ borderRadius: 5 }} variant="outlined" key="All" label={selected} />;
        }}
        // MenuProps={MenuProps}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
