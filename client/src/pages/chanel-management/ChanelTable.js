import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { IconButton } from '../../../node_modules/@mui/material/index';
import { chanelChanelsSelector, chanelIsLoadingSelector } from 'store/slices/chanel/chanelSelector';
import { fetchAllChanel, fetchDeleteChanel } from 'store/slices/chanel/fetchChanel';
import { deleteChanel } from 'store/slices/chanel/chanelSlice';
const chanelTableCell = [
  {
    id: 'id',
    label: 'ID.'
  },
  {
    id: 'name',
    label: 'Name'
  },
  {
    id: 'source',
    label: 'Source'
  }
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function ChanelTable({ order = 'desc', orderBy = 'id', updateChanelHandler }) {
  const dispatch = useDispatch();
  const chanelsIsLoading = useSelector(chanelIsLoadingSelector);
  const chanels = useSelector(chanelChanelsSelector);

  useEffect(() => {
    dispatch(fetchAllChanel());
  }, []);

  const handleDelete = (id) => {
    dispatch(fetchDeleteChanel({ id })).then((action) => {
      if (action.type === 'chanel/delete/fetch/fulfilled') {
        dispatch(deleteChanel({ id }));
      }
    });
  };

  if (chanelsIsLoading) {
    return null;
  }

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3
            }
          }}
        >
          <TableHead>
            <TableRow>
              {chanelTableCell.map((headCell) => (
                <TableCell key={headCell.id} align={'center'} padding={'normal'} sortDirection={orderBy === headCell.id ? order : false}>
                  {headCell.label}
                </TableCell>
              ))}
              <TableCell key={'actions'} align={'center'} padding={'normal'} sortDirection={orderBy === 'actions' ? order : false}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(chanels || [], getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow hover role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1} key={row[orderBy]}>
                  {chanelTableCell.map(({ id: cellId }) => (
                    <TableCell key={Math.random()} id={labelId} component="th" align="center">
                      {row[cellId]}
                    </TableCell>
                  ))}
                  <TableCell key={Math.random()} id={labelId} component="th" align="center">
                    <>
                      <IconButton aria-label="delete" onClick={() => handleDelete(row.id)} size="large" color="error">
                        <DeleteOutlined />
                      </IconButton>
                      <IconButton aria-label="update" onClick={() => updateChanelHandler(row)} size="large" color="primary">
                        <EditOutlined />
                      </IconButton>
                    </>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

ChanelTable.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};
