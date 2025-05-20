export function addTotalRow(report, data) {
  switch (report) {
    case 'Booking Products Value Report':
      return [
        ...data.map((row, i) => ({ ...row, id: i + 1 })),
        {
          id: 'TOTAL',
          label: 'Total',
          value: data.reduce((acc, row) => acc + (parseInt(row.value) || 0), 0),
          quantity: data.reduce((acc, row) => acc + (parseInt(row.quantity) || 0), 0)
        }
      ];
    case 'Dispatch Report':
      return [
        ...data.map((row, i) => ({ ...row, id: i + 1 })),
        {
          id: 'TOTAL',
          label: 'Total',
          totalDispatched: data.reduce((acc, row) => acc + (parseInt(row.dispatched) || 0), 0)
        }
      ];
    case 'Channel Report':
      return [
        ...data.map((row) => ({ ...row, id: `${row.agent}-${row.chanel}-${row.orders}-${row.units}` })),
        {
          id: 'TOTAL',
          label: 'Total',
          totalOrders: data.reduce((acc, row) => acc + (parseInt(row.orders) || 0), 0),
          totalCancelOrders: data.reduce((acc, row) => acc + (parseInt(row.cancel) || 0), 0),
          totalNoPickOrders: data.reduce((acc, row) => acc + (parseInt(row.no_pick) || 0), 0),
          totalDuplicatedOrders: data.reduce((acc, row) => acc + (parseInt(row.duplicated) || 0), 0),
          totalConfirmedOrders: data.reduce((acc, row) => acc + (parseInt(row.confirmed) || 0), 0),
          totalConfirmedOrdersCOD: data.reduce((acc, row) => acc + (parseInt(row.order_confirmed_cod) || 0), 0),
          totalUnitGenerated: data.reduce((acc, row) => acc + (parseInt(row.unit_generated) || 0), 0),
          totalUnitConfirmed: data.reduce((acc, row) => acc + (parseInt(row.unit_confirmed) || 0), 0),
          totalUnitDuplicated: data.reduce((acc, row) => acc + (parseInt(row.unit_duplicated) || 0), 0)
        }
      ];
    case 'Channel Order Report':
      return [
        ...data.map((row) => ({ ...row, id: `${row.agent}-${row.chanel}-${row.orders}-${row.units}` })),
        {
          id: 'TOTAL',
          label: 'Total',
          totalOrders: data.reduce((acc, row) => acc + (parseInt(row.orders) || 0), 0),
          totalConfirmedOrders: data.reduce((acc, row) => acc + (parseInt(row.confirmed) || 0), 0),
          totalDuplicatedOrders: data.reduce((acc, row) => acc + (parseInt(row.duplicate) || 0), 0),
          totalCancelOrders: data.reduce((acc, row) => acc + (parseInt(row.cancel) || 0), 0),
          totalNoPickOrders: data.reduce((acc, row) => acc + (parseInt(row.no_pick) || 0), 0),
          totalUnitGenerated: data.reduce((acc, row) => acc + (parseInt(row.unit_generated) || 0), 0),
          totalUnitConfirmed: data.reduce((acc, row) => acc + (parseInt(row.unit_confirmed) || 0), 0),
          totalUnitDuplicated: data.reduce((acc, row) => acc + (parseInt(row.unit_duplicated) || 0), 0)
        }
      ];
    case 'Agent Report':
      return [
        ...data.map((row) => ({ ...row, id: `${row.user_id}-${row.cancel}-${row.total}-${row.confirmed}` })),
        {
          id: 'TOTAL',
          label: 'Total',
          totalCancel: data.reduce((acc, row) => acc + (parseInt(row.cancel) || 0), 0),
          totalConfirmed: data.reduce((acc, row) => acc + (parseInt(row.confirmed) || 0), 0),
          totalAssigned: data.reduce((acc, row) => acc + (parseInt(row.assigned) || 0), 0),
          totalNoPick: data.reduce((acc, row) => acc + (parseInt(row.no_pick) || 0), 0),
          totalPaymentPending: data.reduce((acc, row) => acc + (parseInt(row.payment_pending) || 0), 0),
          grandTotal: data.reduce((acc, row) => acc + (parseInt(row.total) || 0), 0)
        }
      ];
    case 'Unit Report':
      return [
        ...data.map((row) => ({ ...row, id: `${row.name}-${row.generated}-${row.confirmed}` })),
        {
          id: 'TOTAL',
          label: 'Total',
          totalGenerated: data.reduce((acc, row) => acc + (parseInt(row.generated) || 0), 0),
          totalConfirmed: data.reduce((acc, row) => acc + (parseInt(row.confirmed) || 0), 0),
          totalUnitGenerated: data.reduce((acc, row) => acc + (parseInt(row.unit_generated) || 0), 0),
          totalUnitBooked: data.reduce((acc, row) => acc + (parseInt(row.unit_booked) || 0), 0),
          totalUnitConfirmed: data.reduce((acc, row) => acc + (parseInt(row.unit_confirmed) || 0), 0),
          totalUnitNoPick: data.reduce((acc, row) => acc + (parseInt(row.unit_no_pick) || 0), 0),
          totalUnitCancel: data.reduce((acc, row) => acc + (parseInt(row.unit_cancel) || 0), 0),
          totalPostex: data.reduce((acc, row) => acc + (parseInt(row.postex) || 0), 0),
          totalTCS: data.reduce((acc, row) => acc + (parseInt(row.tcs) || 0), 0),
          totalDeawoo: data.reduce((acc, row) => acc + (parseInt(row.deawoo) || 0), 0),
          totalTrax: data.reduce((acc, row) => acc + (parseInt(row.trax) || 0), 0),
          totalLeapard: data.reduce((acc, row) => acc + (parseInt(row.leapard) || 0), 0),
          totalCallCourier: data.reduce((acc, row) => acc + (parseInt(row.callcourier) || 0), 0),
          totalMNP: data.reduce((acc, row) => acc + (parseInt(row.mnp) || 0), 0),
          totalManual: data.reduce((acc, row) => acc + (parseInt(row.manual) || 0), 0)
        }
      ];
    case 'FOC Report':
      return [
        ...data.map((row) => ({ ...row, id: `${row.name}-${row.generated}-${row.confirmed}` })),
        {
          id: 'TOTAL',
          label: 'Total',
          totalFOC: data.reduce((acc, row) => acc + (parseInt(row.foc) || 0), 0),
          totalPostex: data.reduce((acc, row) => acc + (parseInt(row.postex) || 0), 0),
          totalTCS: data.reduce((acc, row) => acc + (parseInt(row.tcs) || 0), 0),
          totalDeawoo: data.reduce((acc, row) => acc + (parseInt(row.deawoo) || 0), 0),
          totalTrax: data.reduce((acc, row) => acc + (parseInt(row.trax) || 0), 0),
          totalLeopard: data.reduce((acc, row) => acc + (parseInt(row.leopard) || 0), 0),
          totalCallCourier: data.reduce((acc, row) => acc + (parseInt(row.callcourier) || 0), 0),
          totalMNP: data.reduce((acc, row) => acc + (parseInt(row.mnp) || 0), 0),
          totalManual: data.reduce((acc, row) => acc + (parseInt(row.manual) || 0), 0)
        }
      ];
    case 'Booking Unit Report':
      return [
        ...data.map((row) => ({ ...row, id: `${row.name}-${row.generated}-${row.confirmed}` })),
        {
          id: 'TOTAL',
          label: 'Total',
          totalGenerated: data.reduce((acc, row) => acc + (parseInt(row.generated) || 0), 0),
          totalConfirmed: data.reduce((acc, row) => acc + (parseInt(row.confirmed) || 0), 0),
          totalUnitGenerated: data.reduce((acc, row) => acc + (parseInt(row.unit_generated) || 0), 0),
          totalUnitBooked: data.reduce((acc, row) => acc + (parseInt(row.unit_booked) || 0), 0),
          totalUnitBookingError: data.reduce((acc, row) => acc + (parseInt(row.unit_booking_error) || 0), 0),
          totalUnitConfirmed: data.reduce((acc, row) => acc + (parseInt(row.unit_confirmed) || 0), 0),
          totalUnitNoPick: data.reduce((acc, row) => acc + (parseInt(row.unit_no_pick) || 0), 0),
          totalUnitCancel: data.reduce((acc, row) => acc + (parseInt(row.unit_cancel) || 0), 0),
          totalPostex: data.reduce((acc, row) => acc + (parseInt(row.postex) || 0), 0),
          totalTCS: data.reduce((acc, row) => acc + (parseInt(row.tcs) || 0), 0),
          totalDeawoo: data.reduce((acc, row) => acc + (parseInt(row.deawoo) || 0), 0),
          totalTrax: data.reduce((acc, row) => acc + (parseInt(row.trax) || 0), 0),
          totalLeopard: data.reduce((acc, row) => acc + (parseInt(row.leopard) || 0), 0),
          totalCallCourier: data.reduce((acc, row) => acc + (parseInt(row.callcourier) || 0), 0),
          totalMNP: data.reduce((acc, row) => acc + (parseInt(row.mnp) || 0), 0),
          totalDigi: data.reduce((acc, row) => acc + (parseInt(row.digi) || 0), 0),
          totalManual: data.reduce((acc, row) => acc + (parseInt(row.manual) || 0), 0)
        }
      ];
    case 'Incentive Report':
      if (!data.length) return data;
      // eslint-disable-next-line no-case-declarations
      const { name, quantity, ...fields } = data[0];
      // eslint-disable-next-line no-case-declarations
      const fieldsArr = Object.keys(fields);
      // eslint-disable-next-line no-case-declarations
      const total = {};
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        for (let j = 0; j < fieldsArr.length; j++) {
          const field = fieldsArr[j];
          if (!/confirmed|delivered/g.test(field)) {
            continue;
          }
          const key = `${field}_total`;
          if (key in total) {
            total[key] += row[field];
          } else {
            total[key] = row[field];
          }
        }
      }
      return [
        ...data,
        {
          id: 'TOTAL',
          label: 'Total',
          ...total
        }
      ];
    default:
      return data;
  }
}
