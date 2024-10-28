import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { rawMaterialIsLoadingSelector, rawMaterialListSelector } from 'store/slices/rawMaterial/RawMaterialSelector';
import { fetchAllRawMaterial, fetchDeleteRawMaterial } from 'store/slices/rawMaterial/fetchRawMaterial';
import { deleteRawMaterial } from 'store/slices/rawMaterial/rawMaterialSlice';

const columns = (handleEditAction, handleDeleteAction) => [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.3
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1.7
  },
  {
    field: 'code',
    headerName: 'Code',
    flex: 1
  },
  {
    field: 'unit_of_measure',
    headerName: 'Unit of Measure',
    flex: 1
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1.7
  },
  {
    field: 'cost_price',
    headerName: 'Price',
    flex: 1
  },
  // {
  //   field: 'category',
  //   headerName: 'Category',
  //   valueGetter: ({ value }) => (value ? value.name : ''),
  //   flex: 1
  // },
  // {
  //   field: 'brand',
  //   headerName: 'Brand',
  //   valueGetter: ({ value }) => (value ? value.name : ''),
  //   flex: 1
  // },
  // {
  //   field: 'supplier',
  //   headerName: 'Supplier',
  //   valueGetter: ({ value }) => (value ? value.name : ''),
  //   flex: 1
  // },
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

export default function RawMaterialTable({ updateHandler }) {
  const dispatch = useDispatch();
  const rawMaterialIsLoading = useSelector(rawMaterialIsLoadingSelector);
  const rawMaterials = useSelector(rawMaterialListSelector);

  useEffect(() => {
    dispatch(fetchAllRawMaterial());
  }, []);

  const deleteHandler = (id) => {
    dispatch(fetchDeleteRawMaterial({ id })).then((action) => {
      if (action.type === 'rawMaterial/delete/fetch/fulfilled') {
        dispatch(deleteRawMaterial({ id }));
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
        loading={rawMaterialIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={rawMaterials}
        columns={columns(updateHandler, deleteHandler)}
      />
    </div>
  );
}
