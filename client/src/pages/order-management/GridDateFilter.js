import { FormControl } from '@mui/material';
import { formatDate } from 'utils/format-date';

export function GridDateFilter({ label = '', value, onChange }) {
  console.log(value);
  return (
    <FormControl sx={{ m: 1 }} size="small">
      <input
        style={{ border: 'none' }}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onFocus={(e) => (e.target.type = 'date')}
        onBlur={(e) => (e.target.type = 'text')}
        placeholder={label}
        value={`${label} ${formatDate('dd/MM/yyyy', value)}`}
      />
    </FormControl>
  );
}
