import ExcelJS from "exceljs";
const workbook = new ExcelJS.Workbook();

const PRODUCT_PRICE_CELL = ["Pack Size:", "Select Bundle", "Size", "Size: "];

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
            if (PRODUCT_PRICE_CELL.includes(cell.value)) {
              rowObj["Product"] = `${worksheet.name} ${
                row.getCell(colNumber).value.split("=")[0]
              }`;
              rowObj["Price"] = row
                .getCell(colNumber)
                .value.split("=")[1]
                .replace(/\D/g, "");
            } else {
              rowObj[cell.value] = row.getCell(colNumber).value;
            }
          });
          rowObj["SKU"] = worksheet.name;
          json.push(rowObj);
        }
      });
    });
    return json;
  } catch (error) {
    throw error;
  }
};
