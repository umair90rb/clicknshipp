import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { unitOfMeasureIsLoadingSelector, unitOfMeasureListSelector } from 'store/slices/unitOfMeasure/unitOfMeasureSelector';
import { fetchAllUnitOfMeasure, fetchDeleteUnitOfMeasure } from 'store/slices/unitOfMeasure/fetchUnitOfMeasure';
import { deleteUnitOfMeasure } from 'store/slices/unitOfMeasure/unitOfMeasureSlice';
import CustomGrid from 'components/CustomGrid';
import useUOMFetch from 'hooks/useUOMFetch';

const columns = (handleUpdate, handleDelete) => [
  {
    field: 'id',
    headerName: 'Serial#'
  },
  {
    field: 'unit',
    headerName: 'Name',
    flex: 1
  },
  {
    field: 'actions',
    headerName: 'Actions',
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
            onClick={() => handleUpdate('Unit', row)}
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

export default function UnitsTable({ handleUpdate }) {
  const dispatch = useDispatch();
  const unitsIsLoading = useSelector(unitOfMeasureIsLoadingSelector);
  const units = useSelector(unitOfMeasureListSelector);
  const { hasPermission } = useAccess();
  const { refresh } = useUOMFetch();

  const handleDelete = (id) => {
    dispatch(fetchDeleteUnitOfMeasure({ id })).then((action) => {
      if (action.type === 'unitOfMeasure/delete/fetch/fulfilled') {
        dispatch(deleteUnitOfMeasure({ id }));
      }
    });
  };

  return (
    <div style={{ width: '100%', minHeight: 250 }}>
      <CustomGrid
        showQuickFilter={false}
        withRefresh={refresh}
        loading={unitsIsLoading}
        rows={units}
        hideFooterPagination
        hideFooter
        columns={columns(
          hasPermission(PERMISSIONS.PERMISSION_UPDATE_BRAND) ? handleUpdate : undefined,
          hasPermission(PERMISSIONS.PERMISSION_DELETE_BRAND) ? handleDelete : undefined
        )}
      />
    </div>
  );
}
