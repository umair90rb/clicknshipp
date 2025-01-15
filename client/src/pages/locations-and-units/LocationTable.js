import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import { locationListSelector, locationIsLoadingSelector } from 'store/slices/location/locationSelector';
import { fetchAllLocation, fetchDeleteLocation } from 'store/slices/location/fetchLocation';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { deleteLocation } from 'store/slices/location/locationSlice';
import { splitAndToUpperCase } from 'utils/string-utils';
const columns = (handleUpdate, handleDelete) => [
  {
    field: 'id',
    headerName: 'Serial#',
    flex: 0.25
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1
  },
  {
    field: 'address',
    headerName: 'Address',
    flex: 1.25
  },
  {
    field: 'type',
    headerName: 'Store Type',
    flex: 1,
    valueGetter: (params) => splitAndToUpperCase(params.row.type) || ''
  },
  {
    field: 'actions',
    headerName: 'Actions',
    type: 'actions',
    flex: 0.5,
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
            onClick={() => handleUpdate('Location', row)}
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

export default function LocationTable({ handleUpdate }) {
  const dispatch = useDispatch();
  const locationIsLoading = useSelector(locationIsLoadingSelector);
  const locations = useSelector(locationListSelector);
  const { hasPermission } = useAccess();

  useEffect(() => {
    dispatch(fetchAllLocation());
  }, []);

  const handleDelete = (id) => {
    dispatch(fetchDeleteLocation({ id })).then((action) => {
      if (action.type === 'location/delete/fetch/fulfilled') {
        dispatch(deleteLocation({ id }));
      }
    });
  };

  return (
    <div style={{ width: '100%', minHeight: 250 }}>
      <DataGrid
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true
          }
        }}
        loading={locationIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={locations}
        columns={columns(
          hasPermission(PERMISSIONS.PERMISSION_UPDATE_BRAND) ? handleUpdate : undefined,
          hasPermission(PERMISSIONS.PERMISSION_DELETE_BRAND) ? handleDelete : undefined
        )}
      />
    </div>
  );
}
