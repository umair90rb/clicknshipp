import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import location from 'utils/location';
import { stockIsLoadingSelector, stockStocksSelector } from 'store/slices/stock/stockSelector';
import { fetchAllStock } from 'store/slices/stock/fetchStock';
import CenterCircularLoader from 'components/CenterCircularLoader';
const stockTableCell = [
  {
    id: ['item', 'item_id'],
    label: 'ID'
  },
  {
    id: ['item', 'name'],
    label: 'Item Name'
  },
  {
    id: 'level',
    label: 'Current Stock'
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

export default function StockTable({ order = 'desc', orderBy = 'id', receiveStock, showHistory }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stockIsLoading = useSelector(stockIsLoadingSelector);
  const stock = useSelector(stockStocksSelector);

  useEffect(() => {
    dispatch(fetchAllStock());
  }, []);

  if (stockIsLoading) {
    <CenterCircularLoader />;
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
              {stockTableCell.map((headCell) => (
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
            {stableSort(stock || [], getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow hover role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1} key={row[orderBy]}>
                  {stockTableCell.map(({ id: cellId }) => (
                    <TableCell key={Math.random()} id={labelId} component="th" align="center">
                      {Array.isArray(cellId) ? row[cellId[0]][cellId[1]] : row[cellId]}
                    </TableCell>
                  ))}
                  <TableCell key={Math.random()} id={labelId} component="th" align="center">
                    <>
                      <IconButton aria-label="history" onClick={() => showHistory(row.id)} size="large" color="success">
                        <ClockCircleOutlined />
                      </IconButton>
                      <IconButton aria-label="receive stock" onClick={() => receiveStock(row.item.item_id)} size="large" color="primary">
                        <ArrowLeftOutlined />
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

StockTable.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  showHistory: PropTypes.func.isRequired,
  receiveStock: PropTypes.func.isRequired
};
