import { useEffect, useState, useRef } from 'react';
import { Paper, Box, InputAdornment, OutlinedInput, Chip, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearch } from 'store/slices/search/fetchSearch';
import { searchErrorSelector, searchIsLoadingSelector, searchResultSelector } from 'store/slices/search/searchSelector';
import CircularLoader from 'components/CircularLoader';
import OrderRow from './OrderRow';
import NoResult from './NoResult';
import { clearSearchState } from 'store/slices/search/searchSlice';

const availableTags = ['Phone', 'Order Number', 'CN', 'Customer Name', 'Item'];

const Search = () => {
  const searchComponentRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const loading = useSelector(searchIsLoadingSelector);
  const result = useSelector(searchResultSelector);
  const error = useSelector(searchErrorSelector);
  const [isFocus, setIsFocus] = useState();
  const [tag, setTag] = useState('');
  const [query, setQuery] = useState('');
  const handleTagDelete = () => setTag('');
  const handleFocus = () => {
    setIsFocus(true);
    if (!tag) {
      setTag('Phone');
    }
  };
  const handleBlur = () => {
    handleTagDelete();
    dispatch(clearSearchState());
    setIsFocus(false);
  };

  const handleFetchSearch = (tag, query) => dispatch(fetchSearch({ body: { query, tag } }));

  const handleQueryChange = (e) => {
    const query = e.target.value;
    setQuery(query);
    if ((tag === 'Phone' && query.length >= 10) || (tag === 'Order Number' && query.length >= 3) || (tag === 'Item' && query.length >= 5)) {
      handleFetchSearch(tag, query);
    }
  };
  const handleKeyDown = (event) => {
    if (event.ctrlKey && (event.key === 'f' || event.key === 'F')) {
      event.preventDefault();
      handleFocus();
      inputRef.current.focus();
    } else if (event.key === 'Escape' && document.activeElement === inputElement) {
      handleBlur();
      setQuery('');
      inputRef.current.blur();
    }
  };
  const handleMouseOutsideClick = (event) => {
    if (searchComponentRef.current && !searchComponentRef.current.contains(event.target) && isFocus) {
      handleBlur();
    }
  };

  const clearSearchHandle = () => {
    handleBlur();
    setQuery('');
    inputRef.current.blur();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseOutsideClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseOutsideClick);
    };
  }, []);

  return (
    <Box
      ref={searchComponentRef}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ width: '100%', ml: { xs: 0, md: 1 }, border: '0px solid black' }}
    >
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
          ref={inputRef}
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
          endAdornment={
            <InputAdornment position="end">
              {(tag === 'Customer Name' || tag === 'CN') && (
                <IconButton onClick={() => handleFetchSearch(tag, query)} aria-label="esc">
                  <SearchIcon />
                </IconButton>
              )}
              {isFocus && (
                <IconButton onClick={clearSearchHandle} aria-label="esc">
                  <CloseIcon />
                </IconButton>
              )}
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          inputProps={{
            'aria-label': 'search',
            autoComplete: 'off'
          }}
          placeholder="Ctrl + F"
          value={query}
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
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                '&-ms-overflow-style:': {
                  display: 'none'
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
