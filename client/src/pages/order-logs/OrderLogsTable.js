import CustomGrid from 'components/CustomGrid';
import useChannelsFetch from 'hooks/useChannelsFetch';
import { GridDropdownFilter } from 'pages/order-management/GridDropdownFilter';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chanelChanelsSelector } from 'store/slices/chanel/chanelSelector';
import { fetchOrderCreateLogs } from 'store/slices/log/fetchLogs';
import { logIsLoadingSelector, logListSelector, logTotalSelector } from 'store/slices/log/logSelector';
import { formatDateTime } from 'utils/format-date';

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    flex: 0.3
  },
  {
    field: 'shop_domain',
    headerName: 'From',
    flex: 0.5
  },
  {
    field: 'order_id',
    headerName: 'OrderId#',
    flex: 0.5
  },
  {
    field: 'shop_id',
    headerName: 'Store Id',
    flex: 0.5
  },
  {
    field: 'received_at',
    headerName: 'Received At',
    flex: 0.4,
    valueGetter: ({ value }) => formatDateTime(value, true)
  },
  {
    field: 'processed_at',
    headerName: 'Processed At',
    flex: 0.4,
    valueGetter: ({ value }) => value && formatDateTime(value, true)
  },
  {
    field: 'webhook_id',
    headerName: 'Webhook Id',
    flex: 0.5
  },
  {
    field: 'status',
    headerName: 'Current Status',
    flex: 0.3
  },
  {
    field: 'error_message',
    headerName: 'Error',
    flex: 0.3
  },
  {
    field: 'retries',
    headerName: 'Retries',
    flex: 0.3
  }
];

export default function OrderLogsTable() {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    status: '',
    from: ''
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [refresh, setRefresh] = useState(true);
  const total = useSelector(logTotalSelector);
  const logList = useSelector(logListSelector);
  const logIsLoading = useSelector(logIsLoadingSelector);
  const channelsList = useSelector(chanelChanelsSelector);

  useChannelsFetch();

  const customActions = useMemo(
    () => [
      <GridDropdownFilter
        key={1}
        label="filter by status"
        options={['all', 'received', 'processed', 'failed']}
        value={filters.status}
        onChange={(e) => {
          const value = e.target.value;
          setFilters((filters) => ({ ...filters, status: value === 'all' ? '' : value }));
        }}
      />,
      <GridDropdownFilter
        key={2}
        label="filter by channel"
        options={['all', ...channelsList.map((c) => c.source)]}
        value={filters.from}
        onChange={(e) => {
          const value = e.target.value;
          setFilters((filters) => ({ ...filters, from: value === 'all' ? '' : value }));
        }}
      />
    ],
    [filters, channelsList]
  );

  const fetchLogs = useCallback(() => dispatch(fetchOrderCreateLogs({ page, limit, filters })), [filters, page, limit, refresh]);

  useEffect(() => {
    fetchLogs();
  }, [filters, page, limit, refresh]);

  return (
    <CustomGrid
      customActions={customActions}
      resource="Order Logs"
      withRefresh={() => setRefresh(!refresh)}
      loading={logIsLoading}
      rows={logList}
      columns={columns}
      paginationMode="server"
      pageSizeOptions={[10, 25, 50, 100]}
      onPaginationModelChange={({ page, pageSize }) => {
        setPage(page);
        setLimit(pageSize);
      }}
      paginationModel={{ page, pageSize: limit }}
      rowCount={total}
    />
  );
}
