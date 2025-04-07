import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { rawMaterialIsLoadingSelector, rawMaterialListSelector } from 'store/slices/rawMaterial/RawMaterialSelector';
import { fetchDeleteRawMaterial } from 'store/slices/rawMaterial/fetchRawMaterial';
import { deleteRawMaterial } from 'store/slices/rawMaterial/rawMaterialSlice';
import CustomGrid from 'components/CustomGrid';
import useRawMaterialsFetch from 'hooks/useRawMaterialsFetch';

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
  {
    field: 're_order_level',
    headerName: 'Re Order Level',
    flex: 1
  },
  {
    field: 'category',
    headerName: 'Category',
    valueGetter: (param) => param.row.category?.name || '',
    flex: 1
  },
  // {
  //   field: 'brand',
  //   headerName: 'Brand',
  //   valueGetter: ({ value }) => (value ? value.name : ''),
  //   flex: 1
  // },
  {
    field: 'supplier',
    headerName: 'Supplier',
    valueGetter: (param) => param.row.supplier?.name || '',
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

export default function RawMaterialTable({ updateHandler }) {
  const dispatch = useDispatch();
  const rawMaterials = useSelector(rawMaterialListSelector);
  const loading = useSelector(rawMaterialIsLoadingSelector);
  const { refresh } = useRawMaterialsFetch();

  const deleteHandler = (id) => {
    dispatch(fetchDeleteRawMaterial({ id })).then((action) => {
      if (action.type === 'rawMaterial/delete/fetch/fulfilled') {
        dispatch(deleteRawMaterial({ id }));
      }
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <CustomGrid
        resource="material"
        withRefresh={refresh}
        loading={loading}
        rows={rawMaterials}
        columns={columns(updateHandler, deleteHandler)}
      />
    </div>
  );
}
