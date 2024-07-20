export function addTotalRow(report, data) {
  switch (report) {
    case 'Channel Report':
      return [
        ...data.map((row) => ({ ...row, id: `${row.agent}-${row.chanel}-${row.orders}-${row.units}` })),
        {
          id: 'TOTAL',
          label: 'Total',
          totalOrders: data.reduce((acc, row) => acc + (parseInt(row.orders) || 0), 0),
          totalUnits: data.reduce((acc, row) => acc + (parseInt(row.units) || 0), 0)
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
          totalNoPick: data.reduce((acc, row) => acc + (parseInt(row.no_pick) || 0), 0),
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
          totalNoPick: data.reduce((acc, row) => acc + (parseInt(row.no_pick) || 0), 0),
          totalCancel: data.reduce((acc, row) => acc + (parseInt(row.cancel) || 0), 0),
          totalPercentage: data.reduce((acc, row) => acc + (row.confirmed / row.generated) * 100, 0) / data.length,
          totalPostex: data.reduce((acc, row) => acc + (parseInt(row.postex) || 0), 0),
          totalTCS: data.reduce((acc, row) => acc + (parseInt(row.tcs) || 0), 0),
          totalDeawoo: data.reduce((acc, row) => acc + (parseInt(row.deawoo) || 0), 0),
          totalTrax: data.reduce((acc, row) => acc + (parseInt(row.trax) || 0), 0),
          totalLeapard: data.reduce((acc, row) => acc + (parseInt(row.leapard) || 0), 0),
          totalCallCourier: data.reduce((acc, row) => acc + (parseInt(row.callcourier) || 0), 0)
        }
      ];
    default:
      return data;
  }
}
