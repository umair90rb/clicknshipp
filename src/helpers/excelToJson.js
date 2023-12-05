import ExcelJS from "exceljs";
const workbook = new ExcelJS.Workbook();

export default async (buffer, sheetName = 1) => {
  try {
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(sheetName);
    const json = [];
    const columns = worksheet.getRow(1);
    worksheet.eachRow((row, rowNumber) => {
      const rowObj = {};
      columns.eachCell((cell, colNumber) => {
        rowObj[cell.value] = row.getCell(colNumber).value;
      });
      json.push(rowObj);
    });
    return json;
  } catch (error) {
    console.error("Error:", error);
  }
};
