import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { brandBrandsSelector, brandIsLoadingSelector } from 'store/slices/brand/brandSelector';
import { fetchAllBrand, fetchDeleteBrand } from 'store/slices/brand/fetchBrand';
import { deleteBrand } from 'store/slices/brand/brandSlice';
const columns = () => [
  {
    field: 'id',
    headerName: 'ID.',
    flex: 0.3
  },
  {
    field: 'name',
    headerName: 'Brand',
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
    getActions: ({ id, row }) => [
      <GridActionsCellItem
        key={id}
        icon={<EditIcon />}
        label="View"
        className="textPrimary"
        onClick={() => handleUpdate('Category', row)}
        color="inherit"
      />,
      <GridActionsCellItem
        key={id}
        icon={<DeleteIcon />}
        label="Disable"
        className="textPrimary"
        onClick={() => handleDelete(id)}
        color="inherit"
      />
    ]
  }
];

export default function BrandTable({ handleUpdate }) {
  const dispatch = useDispatch();
  const brandIsLoading = useSelector(brandIsLoadingSelector);
  const brands = useSelector(brandBrandsSelector);

  useEffect(() => {
    dispatch(fetchAllBrand());
  }, []);

  const handleDelete = (id) => {
    dispatch(fetchDeleteBrand({ id })).then((action) => {
      if (action.type === 'brand/delete/fetch/fulfilled') {
        dispatch(deleteBrand({ id }));
      }
    });
  };

  return (
    <div style={{ height: '40vh', width: '100%' }}>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        loading={brandIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={brands}
        columns={columns(handleUpdate, handleDelete)}
      />
    </div>
  );
}
