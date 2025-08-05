import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CustomGrid from 'components/CustomGrid';
import MainCard from 'components/MainCard';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderCreateLogs } from 'store/slices/log/fetchLogs';
import { logIsLoadingSelector, logListSelector } from 'store/slices/log/logSelector';
import formatDateTime from 'utils/format-date';

const logs = [
  {
    id: 'da64edc3-3331-48c2-b1b4-19d0466d51b8',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '872',
    received_at: '2025-08-05T11:10:57.917Z',
    processed_at: '2025-08-05T11:10:58.037Z',
    status: 'processed',
    error_message: null,
    retries: 0
  },
  {
    id: '804080cb-9c31-4ba8-98a5-29fe8092aa69',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '910',
    received_at: '2025-08-05T11:09:36.658Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'e6f4eccd-3fe2-48ba-a054-5fc9da90f117',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '46',
    received_at: '2025-08-05T11:07:22.050Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: '5edc77fe-f2b7-4fb3-9b73-d2eea30ac6b2',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '131',
    received_at: '2025-08-05T11:06:15.877Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'dfabda21-2ad0-4aac-b93c-ca1b66047326',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '450',
    received_at: '2025-08-05T11:02:49.566Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'e12a0c62-82d3-4953-b569-fe621fdcac9c',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '386',
    received_at: '2025-08-05T10:57:21.477Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: '8a7d61e0-1f45-4337-b21b-ff7ee592deab',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '928',
    received_at: '2025-08-05T10:53:48.649Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: '21399bfb-825e-4181-8f69-be2b6c45137c',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '665',
    received_at: '2025-08-05T10:53:23.331Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'b8e43517-02c5-4485-a7ee-0eac73815787',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '685',
    received_at: '2025-08-05T10:50:58.383Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'da64edc3-3331-48c2-b1b4-19d0466d51b8',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '872',
    received_at: '2025-08-05T11:10:57.917Z',
    processed_at: '2025-08-05T11:10:58.037Z',
    status: 'processed',
    error_message: null,
    retries: 0
  },
  {
    id: '804080cb-9c31-4ba8-98a5-29fe8092aa69',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '910',
    received_at: '2025-08-05T11:09:36.658Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'e6f4eccd-3fe2-48ba-a054-5fc9da90f117',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '46',
    received_at: '2025-08-05T11:07:22.050Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: '5edc77fe-f2b7-4fb3-9b73-d2eea30ac6b2',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '131',
    received_at: '2025-08-05T11:06:15.877Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'dfabda21-2ad0-4aac-b93c-ca1b66047326',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '450',
    received_at: '2025-08-05T11:02:49.566Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'e12a0c62-82d3-4953-b569-fe621fdcac9c',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '386',
    received_at: '2025-08-05T10:57:21.477Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: '8a7d61e0-1f45-4337-b21b-ff7ee592deab',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '928',
    received_at: '2025-08-05T10:53:48.649Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: '21399bfb-825e-4181-8f69-be2b6c45137c',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '665',
    received_at: '2025-08-05T10:53:23.331Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'b8e43517-02c5-4485-a7ee-0eac73815787',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '685',
    received_at: '2025-08-05T10:50:58.383Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'da64edc3-3331-48c2-b1b4-19d0466d51b8',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '872',
    received_at: '2025-08-05T11:10:57.917Z',
    processed_at: '2025-08-05T11:10:58.037Z',
    status: 'processed',
    error_message: null,
    retries: 0
  },
  {
    id: '804080cb-9c31-4ba8-98a5-29fe8092aa69',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '910',
    received_at: '2025-08-05T11:09:36.658Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'e6f4eccd-3fe2-48ba-a054-5fc9da90f117',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '46',
    received_at: '2025-08-05T11:07:22.050Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: '5edc77fe-f2b7-4fb3-9b73-d2eea30ac6b2',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '131',
    received_at: '2025-08-05T11:06:15.877Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'dfabda21-2ad0-4aac-b93c-ca1b66047326',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '450',
    received_at: '2025-08-05T11:02:49.566Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'e12a0c62-82d3-4953-b569-fe621fdcac9c',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '386',
    received_at: '2025-08-05T10:57:21.477Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: '8a7d61e0-1f45-4337-b21b-ff7ee592deab',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '928',
    received_at: '2025-08-05T10:53:48.649Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: '21399bfb-825e-4181-8f69-be2b6c45137c',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '665',
    received_at: '2025-08-05T10:53:23.331Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  },
  {
    id: 'b8e43517-02c5-4485-a7ee-0eac73815787',
    shop_id: null,
    shop_domain: 'umair90rb.myshopify.com',
    topic: 'order/create',
    webhook_id: '685',
    received_at: '2025-08-05T10:50:58.383Z',
    processed_at: null,
    status: 'received',
    error_message: null,
    retries: 0
  }
];

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

const OrderLogs = () => {
  const dispatch = useDispatch();
  const logList = useSelector(logListSelector);
  const logIsLoading = useSelector(logIsLoadingSelector);

  useEffect(() => {
    dispatch(fetchOrderCreateLogs());
  }, [])

  return (
    <>
      <Grid item xs={12} md={12} lg={12}>
        <Grid item>
          <Typography variant="h5">Order Logs</Typography>
        </Grid>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item></Grid>
        </Grid>
        <MainCard>
          <CustomGrid loading={logIsLoading} rows={logList} columns={columns} />
        </MainCard>
      </Grid>
    </>
  );
};

export default OrderLogs;
