import { Paper, Box, InputAdornment, OutlinedInput, Chip, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearch } from 'store/slices/search/fetchSearch';
import { searchErrorSelector, searchIsLoadingSelector, searchResultSelector } from 'store/slices/search/searchSelector';
import CircularLoader from 'components/CircularLoader';
import OrderRow from './OrderRow';
import NoResult from './NoResult';

const availableTags = ['Phone', 'Order Number', 'Item'];

const Search = () => {
  const dispatch = useDispatch();
  const loading = useSelector(searchIsLoadingSelector);
  const result = useSelector(searchResultSelector);
  const error = useSelector(searchErrorSelector);
  const [isFocus, setIsFocus] = useState();
  const handleFocus = () => setIsFocus(true);
  const handleBlur = () => setIsFocus(false);
  const [tag, setTag] = useState('');
  const handleTagDelete = () => setTag('');

  const handleQueryChange = (e) => {
    const query = e.target.value;
    if ((tag === 'Phone' && query.length >= 11) || (tag === 'Order Number' && query.length >= 3) || (tag === 'Item' && query.length >= 5)) {
      dispatch(fetchSearch({ body: { query, tag } }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const inputElement = document.getElementById('header-search');
      if (event.ctrlKey && (event.key === 'f' || event.key === 'F')) {
        event.preventDefault();
        handleFocus();
        setTag('Phone');
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
          overflow: isFocus ? 'auto' : 'none',
          overflowX: 'hidden'
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
          onFocus={handleFocus}
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
            {loading && <CircularLoader height="18vh" />}
            {error && !loading && <NoResult message={error} />}
            <Box
              sx={{
                width: '100%',
                maxHeight: '75vh',
                overflow: 'auto',
                overflowX: 'hidden',
                border: '0px solid black',
                scrollbarWidth: 'none', // Hide the scrollbar for firefox
                '&::-webkit-scrollbar': {
                  display: 'none' // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
                },
                '&-ms-overflow-style:': {
                  display: 'none' // Hide the scrollbar for IE
                }
              }}
            >
              {result && result.map((r, index) => <OrderRow key={index} order={r} onNavigate={handleBlur} />)}
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Search;
