import { useState, useCallback, useLayoutEffect } from 'react';
import { useGridApiContext } from '@mui/x-data-grid';
import InputBase from '@mui/material/InputBase';
export default function GridEditTextarea(props) {
  const { id, field, value, colDef, hasFocus, tabIndex, ...rest } = props;
  const [valueState, setValueState] = useState(value);
  const [inputRef, setInputRef] = useState(null);
  const apiRef = useGridApiContext();
  console.log(tabIndex, 'tabIndextabIndextabIndextabIndex');

  useLayoutEffect(() => {
    if (hasFocus && inputRef) {
      inputRef.focus();
      const length = inputRef.value.length;
      inputRef.setSelectionRange(length, length);
      inputRef.scrollTop = inputRef.scrollHeight;
    }
  }, [hasFocus, inputRef]);

  const handleChange = useCallback(
    async (event) => {
      const newValue = event.target.value;
      setValueState(newValue);
      await apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 200 }, event);
    },
    [apiRef, field, id]
  );

  return (
    <InputBase
      multiline
      rows={4}
      value={valueState}
      sx={{
        textarea: { resize: 'none', overflow: 'hidden', tabIndex: 0 },
        width: '100%'
      }}
      onChange={handleChange}
      inputRef={(ref) => setInputRef(ref)}
    />
  );
}
