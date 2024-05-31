import { Typography, Paper, Box, InputAdornment, OutlinedInput, Chip, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearch } from 'store/slices/search/fetchSearch';
import { searchIsLoadingSelector, searchResultSelector } from 'store/slices/search/searchSelector';
import CircularLoader from 'components/CircularLoader';
import OrderRow from './OrderRow';

const availableTags = ['Orders', 'Customers'];

const Search = () => {
  const dispatch = useDispatch();
  const searchIsLoading = useSelector(searchIsLoadingSelector);
  const result = useSelector(searchResultSelector);
  const [isFocus, setIsFocus] = useState();
  const handleFocus = () => setIsFocus(true);
  const handleBlur = () => setIsFocus(false);
  const [tag, setTag] = useState('Orders');
  const handleTagDelete = () => setTag('');

  const handleQueryChange = (e) => {
    const query = e.target.value;
    if (query.length >= 10) {
      dispatch(fetchSearch({ body: { query, tag } }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const inputElement = document.getElementById('header-search');
      if (event.ctrlKey && (event.key === 'f' || event.key === 'F')) {
        event.preventDefault();
        handleFocus();
        setTag('Orders');
        inputElement.focus();
      } else if (event.key === 'Escape' && document.activeElement === inputElement) {
        setTag('');
        handleBlur();
        inputElement.value = '';
        inputElement.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%', ml: { xs: 0, md: 1 }, border: '0px solid black' }}>
      <Paper
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          position: 'fixed',
          top: '0%',
          width: '50%',
          minHeight: isFocus ? '25vh' : 0,
          zIndex: 2,
          padding: 1.5,
          overflow: isFocus ? 'auto' : 'none'
        }}
        elevation={isFocus ? 4 : 0}
      >
        <OutlinedInput
          fullWidth
          size="small"
          id="header-search"
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchIcon fontSize="small" />
              {tag && (
                <Chip onDelete={handleTagDelete} key={tag} label={tag} sx={{ ml: 0.5, borderRadius: 5 }} size="small" variant="outlined" />
              )}
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          inputProps={{
            'aria-label': 'search',
            autoComplete: 'off'
          }}
          placeholder="Ctrl + F"
          onChange={handleQueryChange}
        />
        {isFocus && (
          <>
            {!tag && (
              <Box sx={{ width: '100%', m: 1, border: '0px solid black' }}>
                {availableTags.map((tag) => (
                  <Chip
                    size="small"
                    variant="outlined"
                    key={tag}
                    label={tag}
                    onClick={() => setTag(tag)}
                    sx={{
                      mr: 0.5,
                      mb: 0.5,
                      borderRadius: 5
                    }}
                    clickable
                  />
                ))}
              </Box>
            )}
            {searchIsLoading && <CircularLoader height="20vh" />}
            {result && result.map((r, index) => <OrderRow key={index} order={r} />)}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Search;
