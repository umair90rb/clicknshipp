import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  GridToolbarExport
} from '@mui/x-data-grid';
import { salesOrderIsLoadingSelector, salesOrderListSelector } from 'store/slices/salesOrder/salesOrderSelector';
import { fetchAllSalesOrder } from 'store/slices/salesOrder/fetchSalesOrder';
import ViewSalesOrderModal from './ViewSalesOrderModal';
import { setSalesOrderViewId, setSalesOrderViewModalVisible } from 'store/slices/salesOrder/salesOrderSlice';
import formatDate from 'utils/format-date';

const columns = (handleView) => [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.25
  },
  {
    field: 'name',
    headerName: 'Name(for)',
    flex: 1
  },
  {
    field: 'comment',
    headerName: 'Comment',
    flex: 1
  },
  {
    field: 'createdAt',
    headerName: 'Created at',
    flex: 1,
    valueFormatter: (row) => formatDate(row?.createdAt)
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    type: 'actions',
    cellClassName: 'actions',
    getActions: (value) => {
      const actions = [
        <GridActionsCellItem
          key={value.row?.id}
          icon={<RemoveRedEyeOutlinedIcon />}
          label="View"
          className="textPrimary"
          onClick={() => handleView(value.row?.id)}
          color="inherit"
        />
      ];
      return actions;
    }
  }
];

export default function SalesOrderTable() {
  const dispatch = useDispatch();
  const salesOrderList = useSelector(salesOrderListSelector);
  const salesOrderIsLoading = useSelector(salesOrderIsLoadingSelector);

  useEffect(() => {
    dispatch(fetchAllSalesOrder());
  }, []);

  const handleView = (id) => {
    dispatch(setSalesOrderViewId(id));
    dispatch(setSalesOrderViewModalVisible(true));
  };

  const renderToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <GridToolbarFilterButton />
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ flexGrow: 1 }}>
        {/* <GridDropdownFilter
          label="filter by status"
          options={['all', ...storeTypes.map((store) => store.value)]}
          value={stockFor}
          onChange={(e) => {
            if (e.target.value.length === 0) {
              setStockFor('all');
              return;
            }
            setStockFor(e.target.value);
          }}
        /> */}
      </Box>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        slots={{ toolbar: renderToolbar }}
        slotProps={{
          toolbar: {
            toolbar: renderToolbar,
            showQuickFilter: true
          }
        }}
        loading={salesOrderIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={salesOrderList}
        columns={columns(handleView)}
      />
      <ViewSalesOrderModal />
    </div>
  );
}
