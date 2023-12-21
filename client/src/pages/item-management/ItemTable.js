import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import location from 'utils/location';
import { itemIsLoadingSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import { fetchAllItem } from 'store/slices/item/fetchItem';
const itemTableCell = [
  {
    id: 'id',
    label: 'ID'
  },
  {
    id: 'name',
    label: 'Item Name'
  },
  {
    id: 'code',
    label: 'Code'
  },
  {
    id: 'price',
    label: 'Price'
  },
  {
    id: ['category', 'name'],
    label: 'Category'
  },
  {
    id: ['brand', 'name'],
    label: 'Brand'
  },
  {
    id: ['supplier', 'name'],
    label: 'Supplier'
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

export default function ItemTable({ order = 'desc', orderBy = 'id' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemIsLoading = useSelector(itemIsLoadingSelector);
  const items = useSelector(itemItemsSelector);

  useEffect(() => {
    dispatch(fetchAllItem());
  }, []);

  if (itemIsLoading) {
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
              {itemTableCell.map((headCell) => (
                <TableCell key={headCell.id} align={'center'} padding={'normal'} sortDirection={orderBy === headCell.id ? order : false}>
                  {headCell.label}
                </TableCell>
              ))}
              {/* <TableCell key={'actions'} align={'center'} padding={'normal'} sortDirection={orderBy === 'actions' ? order : false}>
                Actions
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(items || [], getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow hover role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1} key={row[orderBy]}>
                  {itemTableCell.map(({ id: cellId }) => (
                    <TableCell key={Math.random()} id={labelId} component="th" align="center">
                      {Array.isArray(cellId) ? (row[cellId[0]] === null ? 'None' : row[cellId[0]][cellId[1]]) : row[cellId]}
                    </TableCell>
                  ))}
                  {/* <TableCell key={Math.random()} id={labelId} component="th" align="center">
                    <>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(row.id)}
                        disabled={row['id'] === user.id}
                        size="large"
                        color="error"
                      >
                        <DeleteOutlined />
                      </IconButton>
                      <IconButton
                        aria-label="update"
                        onClick={() => handleUpdate(row, index)}
                        disabled={row['id'] === user.id}
                        size="large"
                        color="primary"
                      >
                        <EditOutlined />
                      </IconButton>
                    </>
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

ItemTable.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};
