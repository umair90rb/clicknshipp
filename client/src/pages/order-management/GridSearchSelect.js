import { useState, useCallback, useLayoutEffect } from 'react';
import { useGridApiContext } from '@mui/x-data-grid';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
// import { useTheme } from "@mui/styles";

// import Popper from '@mui/material/Popper';
// import Paper from '@mui/material/Paper';
// import InputBase from '@mui/material/InputBase';
// import Autocomplete from '@mui/material/Autocomplete';
import { useSelector } from 'react-redux';
import { cityCitiesSelector } from 'store/slices/city/citySelector';

// export default function GridSearchSelect(props) {
//   const { id, field, value, colDef, hasFocus } = props;
//   const citiesList = useSelector(cityCitiesSelector);
//   const [valueState, setValueState] = useState(value);
//   const [anchorEl, setAnchorEl] = useState();
//   const [locInputRef, setInputRef] = useState(null);
//   const apiRef = useGridApiContext();

//   useLayoutEffect(() => {
//     if (hasFocus && locInputRef) {
//       locInputRef.focus();
//     }
//   }, [hasFocus, locInputRef]);

//   const handleRef = useCallback((el) => {
//     setAnchorEl(el);
//   }, []);

//   const handleChange = useCallback(
//     (event) => {
//       const newValue = event.target.value;
//       const city = citiesList[newValue];
//       console.log(city, 'newValue');
//       setValueState(city);
//       apiRef.current.setEditCellValue({ id, field, value: city, debounceMs: 200 }, event);
//     },
//     [apiRef, field, id]
//   );

//   return (
//     <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
//       <div
//         ref={handleRef}
//         style={{
//           height: 1,
//           width: colDef.computedWidth,
//           display: 'block',
//           position: 'absolute',
//           top: 0
//         }}
//       />
//       {anchorEl && (
//         <Popper open anchorEl={anchorEl} placement="bottom-start">
//           <Paper elevation={1} sx={{ p: 1, minWidth: colDef.computedWidth, height: colDef.computedHeight }}>
//             <Autocomplete
//               inputRef={(ref) => setInputRef(ref)}
//               disablePortal
//               id="combo-box-demo"
//               options={citiesList}
//               openOnFocus
//               disableClearable
//               clearOnEscape
//               autoHighlight
//               freeSolo
//               value={valueState}
//               onChange={handleChange}
//               renderInput={(params) => (
//                 <InputBase
//                   {...params}
//                   rows={4}
//                   value={valueState}
//                   sx={{ width: '100%' }}
//                   onChange={handleChange}
//                   inputRef={(ref) => setInputRef(ref)}
//                 />
//               )}
//               //   renderInput={(params) => <TextField {...params} label="City" />}
//             />
//             {/* <InputBase
//               multiline
//               rows={4}
//               value={valueState}
//               sx={{ textarea: { resize: 'both' }, width: '100%' }}
//               onChange={handleChange}
//               inputRef={(ref) => setInputRef(ref)}
//             /> */}
//           </Paper>
//         </Popper>
//       )}
//     </div>
//   );
// }

export default function GridSearchSelect(props) {
  const { id, field, value } = props;
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
