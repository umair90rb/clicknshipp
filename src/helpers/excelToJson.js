import ExcelJS from "exceljs";
const workbook = new ExcelJS.Workbook();

export default async (buffer) => {
  try {
    const json = [];
    await workbook.xlsx.load(buffer);
    workbook.eachSheet((worksheet) => {
      const columns = worksheet.getRow(1);
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const rowObj = {};
          columns.eachCell((cell, colNumber) => {
            rowObj[cell.value] = row.getCell(colNumber).value;
          });
          json.push(rowObj);
        }
      });
    });
    return json;
  } catch (error) {
    throw error;
  }
};
