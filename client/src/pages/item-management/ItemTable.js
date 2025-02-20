import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { itemIsLoadingSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import { fetchAllItem, fetchDeleteItem } from 'store/slices/item/fetchItem';
import { deleteItem } from 'store/slices/item/itemSlice';
import GridCustomToolbar from 'components/GridCustomToolbar';
const columns = (handleEditAction, handleDeleteAction) => [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.3
  },
  {
    field: 'name',
    headerName: 'Item Name',
    flex: 1.7
  },
  {
    field: 'code',
    headerName: 'Code',
    flex: 1
  },
  {
    field: 'unit_of_measure',
    headerName: 'Unit',
    flex: 1
  },
  {
    field: 'unit_price',
    headerName: 'Price',
    flex: 1
  },
  {
    field: 'category',
    headerName: 'Category',
    valueGetter: ({ value }) => (value ? value.name : ''),
    flex: 1
  },
  {
    field: 'brand',
    headerName: 'Brand',
    valueGetter: ({ value }) => (value ? value.name : ''),
    flex: 1
  },
  {
    field: 'supplier',
    headerName: 'Supplier',
    valueGetter: ({ value }) => (value ? value.name : ''),
    flex: 1
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    type: 'actions',
    cellClassName: 'actions',
    getActions: ({ id, row }) => [
      <GridActionsCellItem
        key={id}
        icon={<EditIcon />}
        label="View"
        className="textPrimary"
        onClick={() => handleEditAction(row)}
        color="inherit"
      />,
      <GridActionsCellItem
        key={id}
        icon={<DeleteIcon />}
        label="Disable"
        className="textPrimary"
        onClick={() => handleDeleteAction(id)}
        color="inherit"
      />
    ]
  }
];

export default function ItemTable({ updateItemHandler }) {
  const dispatch = useDispatch();
  const itemIsLoading = useSelector(itemIsLoadingSelector);
  const items = useSelector(itemItemsSelector);
  const fetchItems = useCallback(() => dispatch(fetchAllItem()), []);

  useEffect(() => {
    fetchItems();
  }, []);

  const deleteItemHandler = (id) => {
    dispatch(fetchDeleteItem({ id })).then((action) => {
      if (action.type === 'item/delete/fetch/fulfilled') {
        dispatch(deleteItem({ id }));
      }
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        slots={{ toolbar: GridCustomToolbar }}
        slotProps={{
          toolbar: {
            withRefresh: fetchItems,
            showQuickFilter: true
          }
        }}
        loading={itemIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={items}
        columns={columns(updateItemHandler, deleteItemHandler)}
        onPaginationModelChange={(model) => console.log(model, 'items pagination model')}
      />
    </div>
  );
}
