import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { formatDistance, parseAndFormatDate, formatDate } from 'utils/format-date';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 600,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9'
    }
  })
);

export default function GridDeliveryStatus({ delivery }) {
  const getLink = (cn, courier) => {
    switch (courier) {
      case 'leopard':
        return `https://www.leopardscourier.com/leopards-tracking`;
      case 'deawoo':
        return `https://fastex.pk`;
      case 'postex':
        return `https://merchant.postex.pk?cn=${cn}`;
      case 'tcs':
        return `https://www.tcsexpress.com/track/${cn}`;
      case 'callcourier':
        return `https://callcourier.com.pk/tracking/?tc=${cn}`;
      case 'trax':
        return `https://sonic.pk/tracking?tracking_number=${cn}`;
      case 'mnp':
        return `https://www.mulphilog.com/tracking/${cn}`;
      case 'manual':
        return '';
      default:
        return '';
    }
  };

  const getHistoryData = (history, courier) => {
    if (history && Array.isArray(history)) {
      switch (courier) {
        case 'leopard':
          return history.map((h) => ({ date: formatDate('MMM d', h.Activity_Date), status: h.Status }));
        case 'deawoo':
          return history.map((h) => ({ date: parseAndFormatDate(h.Date, 'dd/MM/yyyy hh:mm:ss a', 'MMM d'), status: h.Status }));
        case 'postex':
          return history.map((h) => ({ date: formatDate('MMM d', h.updatedAt), status: h.transactionStatusMessage }));
        case 'tcs':
          return history.map((h) => ({ date: parseAndFormatDate(h.datetime, 'EEEE MMM d, yyyy HH:mm', 'MMM d'), status: h.status }));
        case 'callcourier':
          return {};
        case 'trax':
          return history.map((h) => ({ date: parseAndFormatDate(h.date_time, 'dd/MM/yyyy hh:mm a', 'MMM d'), status: h.status }));
        case 'mnp':
          return history.map((h) => ({
            date: parseAndFormatDate(h.DateTime, 'dd/MM/yyyy hh:mm:ss a', 'MMM d'),
            status: `${h.Status} at ${h.Location}`
          }));
        case 'manual':
          return '';
        default:
          return '';
      }
    }
  };

  const renderHistory = () => {
    const data = getHistoryData(JSON.parse(delivery?.tracking), delivery?.courier);
    return (
      <>
        {data &&
          Array.isArray(data) &&
          data.reverse().map((item, index) => (
            <div key={index}>
              <div>
                • {item.status} at {item.date}
              </div>
              {index !== data.length - 1 && <div>|</div>}
            </div>
          ))}
      </>
    );
  };

  return (
    delivery && (
      <Box>
        <Typography>
          {delivery?.status} {delivery?.updatedAt && '(updated ' + formatDistance(delivery?.updatedAt) + ')'}
        </Typography>
        <Link target="_blank" href={getLink(delivery?.cn, delivery?.courier)}>
          {delivery?.cn}
        </Link>
        {'\n'}
        {delivery?.tracking && (
          <HtmlTooltip placement="left" title={renderHistory()}>
            <Link>History</Link>
          </HtmlTooltip>
        )}
      </Box>
    )
  );
}
