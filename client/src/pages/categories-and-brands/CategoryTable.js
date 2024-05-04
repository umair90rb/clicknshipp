import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { categoryCategoriesSelector, categoryIsLoadingSelector } from 'store/slices/category/categorySelector';
import { fetchAllCategory, fetchDeleteCategory } from 'store/slices/category/fetchCategory';
import { deleteCategory } from 'store/slices/category/categorySlice';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
const columns = (handleUpdate, handleDelete) => [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.3
  },
  {
    field: 'name',
    headerName: 'Category',
    flex: 1.7
  },
  {
    field: 'itemCount',
    headerName: 'Items',
    flex: 1
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    type: 'actions',
    cellClassName: 'actions',
    getActions: ({ id, row }) => {
      const actions = [];

      if (handleUpdate) {
        actions.push(
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="View"
            className="textPrimary"
            onClick={() => handleUpdate('Category', row)}
            color="inherit"
          />
        );
      }
      if (handleDelete) {
        actions.push(
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Disable"
            className="textPrimary"
            onClick={() => handleDelete(id)}
            color="inherit"
          />
        );
      }
      return actions;
    }
  }
];

export default function CategoryTable({ handleUpdate }) {
  const dispatch = useDispatch();
  const categoryIsLoading = useSelector(categoryIsLoadingSelector);
  const categories = useSelector(categoryCategoriesSelector);

  const { hasPermission } = useAccess();

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, []);

  const handleDelete = (id) => {
    dispatch(fetchDeleteCategory({ id })).then((action) => {
      if (action.type === 'category/delete/fetch/fulfilled') {
        dispatch(deleteCategory({ id }));
      }
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        loading={categoryIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={categories}
        columns={columns(
          hasPermission(PERMISSIONS.PERMISSION_UPDATE_CATEGORY) ? handleUpdate : undefined,
          hasPermission(PERMISSIONS.PERMISSION_DELETE_CATEGORY) ? handleDelete : undefined
        )}
      />
    </div>
  );
}
