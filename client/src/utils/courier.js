export default function getLink(cn, courier) {
  switch (courier) {
    case 'leopard':
      return `https://www.leopardscourier.com/leopards-tracking`;
    case 'digi_leopard':
      return `https://www.leopardscourier.com/leopards-tracking`;
    case 'deawoo':
      return `https://fastex.pk`;
    case 'postex':
      return `https://merchant.postex.pk?cn=${cn}`;
    case 'digi_bluex':
      return `https://www.blue-ex.com/`;
    case 'tcs':
      return `https://www.tcsexpress.com/track/${cn}`;
    case 'callcourier':
      return `https://callcourier.com.pk/tracking/?tc=${cn}`;
    case 'trax':
      return `https://sonic.pk/tracking?tracking_number=${cn}`;
    case 'digi_trax':
      return `https://sonic.pk/tracking?tracking_number=${cn}`;
    case 'mnp':
      return `https://www.mulphilog.com/tracking/${cn}`;
    case 'digi_mnp':
      return `https://www.mulphilog.com/tracking/${cn}`;
    case 'digi_swift':
      return `https://www.swiftcourrier.com`;
    case 'manual':
      return '';
    default:
      return '';
  }
}
