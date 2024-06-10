import { useState, useCallback } from 'react';
import { useGridApiContext } from '@mui/x-data-grid';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { cityCitiesSelector } from 'store/slices/city/citySelector';

export default function GridSearchSelect(props) {
  const { id, field, value, multiple = false } = props;
  const citiesList = useSelector(cityCitiesSelector);
  const [open, setOpen] = useState(false);
  const apiRef = useGridApiContext();

  const handleChange = useCallback(
    (event, newValue) => {
      apiRef.current.setEditCellValue({ id, field, value: newValue }, event);
      setOpen(false);
    },
    [apiRef, field, id]
  );

  return (
    <Autocomplete
      sx={{
        height: '100%',
        [`& .${autocompleteClasses.inputRoot}`]: {
          padding: '1px 0',
          height: '100%',
          '& input': {
            padding: '0 16px',
            height: '100%'
          }
        }
      }}
      value={value}
      onChange={handleChange}
      options={citiesList}
      getOptionLabel={(option) => option}
      autoHighlight
      fullWidth
      // multiple={multiple}
      // freeSolo={multiple}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      disableClearable
      renderOption={(optionProps, option) => (
        <Box
          component="li"
          sx={{
            '& > img': {
              mr: 1.5,
              flexShrink: 0
            }
          }}
          {...optionProps}
        >
          {option}
        </Box>
      )}
      renderInput={(params) => (
        <InputBase
          autoFocus
          fullWidth
          id={params.id}
          inputProps={{
            ...params.inputProps,
            tabIndex: 0,
            autoComplete: 'new-password' // disable autocomplete and autofill
          }}
          {...params.InputProps}
        />
      )}
    />
  );
}
