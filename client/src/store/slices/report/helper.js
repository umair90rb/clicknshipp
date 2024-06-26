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
    default:
      return data;
  }
}
