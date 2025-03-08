import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { billOfMaterialIsLoadingSelector, billOfMaterialListSelector } from 'store/slices/billOfMaterial/billOfMaterialSelector';
import { fetchAllBillOfMaterial } from 'store/slices/billOfMaterial/fetchBillOfMaterial';
import { formatDistance } from 'utils/format-date';
import GridCustomToolbar from 'components/GridCustomToolbar';
const columns = (handleView) => [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.25
  },
  {
    field: 'comment',
    headerName: 'Comment',
    flex: 1
  },
  {
    field: 'user',
    headerName: 'Requested by',
    flex: 1,
    valueGetter: (value) => `${value?.row.user?.name || ''}`
  },
  {
    field: 'item',
    headerName: 'For Item',
    flex: 1,
    valueGetter: (value) => `${value.row.item?.name || ''}`
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    flex: 1,
    valueGetter: (value) => `${value?.value || ''} ${value.row?.unit_of_measure}`
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1
  },
  {
    field: 'createdAt',
    headerName: 'Requested At',
    flex: 1,
    valueGetter: (value) => formatDistance(value?.value)
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    type: 'actions',
    cellClassName: 'actions',
    getActions: (value) => {
      const actions = [];

      if (handleView) {
        actions.push(
          <GridActionsCellItem
            key={value.row?.id}
            icon={<VisibilityOutlinedIcon />}
            label="View"
            className="textPrimary"
            onClick={() => handleView(value.row?.id)}
            color="inherit"
          />
        );
      }
      return actions;
    }
  }
];

export default function StockTable({ handleView }) {
  const dispatch = useDispatch();
  const bomIsLoading = useSelector(billOfMaterialIsLoadingSelector);
  const billOfMaterials = useSelector(billOfMaterialListSelector);
  const { hasPermission } = useAccess();
  const allowViewHistory = useMemo(() => hasPermission(hasPermission(PERMISSIONS.PERMISSION_VIEW_STOCK_HISTORY)), []);
  const fetchBOM = useCallback(() => dispatch(fetchAllBillOfMaterial()), []);

  useEffect(() => {
    fetchBOM();
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        slots={{ toolbar: GridCustomToolbar }}
        slotProps={{
          toolbar: {
            withRefresh: fetchBOM
          }
        }}
        loading={bomIsLoading}
        pageSizeOptions={[25, 50, 75, 100]}
        rows={billOfMaterials}
        columns={columns(allowViewHistory ? handleView : undefined)}
      />
    </div>
  );
}
