import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import GridToolbarWithHeading from 'components/GridToolbarWithHeading';
import CustomNoRowsOverlay from 'components/GridNoRowCustomOverlay';
import { reportDataSelector, reportIsLoadingSelector } from 'store/slices/report/reportSelector';
import { toSentence } from 'utils/string-utils';

const columns = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1.5,
    valueGetter: (params) => {
      if (params.row.id === 'TOTAL') {
        return params.row.label;
      }
      return params.value;
    }
  }
];
// let columnGroupingModel = [{ groupId: 'Item Info', children: [{ field: 'name' }, { field: 'quantity' }] }];

export default function IncentiveReport() {
  const reportIsLoading = useSelector(reportIsLoadingSelector);
  const data = useSelector(reportDataSelector);
  let withAgentColumns = [...columns];

  const renderToolbar = () => <GridToolbarWithHeading heading="Incentive Report" />;

  if (data && data.length) {
    const { name, quantity, ...restColumns } = data[0];
    const columnArray = Object.keys(restColumns);
    for (let k of columnArray) {
      if (!/confirmed|delivered/g.test(k)) {
        continue;
      }
      const confirmKey = `${k}`;
      // const deliverKey = `${k}_delivered`;
      withAgentColumns.push(
        {
          field: confirmKey,
          headerName: `${toSentence(k.split('_').join(' '))}`,
          flex: 0.5,
          valueGetter: (params) => {
            if (params.row.id === 'TOTAL') {
              return params.row[`${confirmKey}_total`];
            }
            return params.value;
          }
        }
        // {
        //   field: deliverKey,
        //   headerName: `${toSentence(k.split('_').join(' '))} Delivered`,
        //   flex: 0.5,
        //   valueGetter: (params) => {
        //     if (params.row.id === 'TOTAL') {
        //       console.log(params);
        //       return params.row[`${deliverKey}_total`];
        //     }
        //     return params.value;
        //   }
        // }
      );
      // columnGroupingModel.push({ groupId: k.toUpperCase(), children: [{ field: confirmKey }, { field: deliverKey }] });
    }
  }

  return (
    <div style={{ width: '100%', height: '75vh' }}>
      <DataGrid
        hideFooterPagination
        checkboxSelection
        loading={reportIsLoading}
        slots={{ toolbar: renderToolbar, noRowsOverlay: CustomNoRowsOverlay }}
        getRowId={(row) => `${Math.random().toString().split('.')[1]}`}
        rows={data}
        columns={withAgentColumns}
        // columnGroupingModel={columnGroupingModel}
      />
    </div>
  );
}
