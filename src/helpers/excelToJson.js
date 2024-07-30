import ExcelJS from "exceljs";
const workbook = new ExcelJS.Workbook();

const PRODUCTS = {
  "FLX-001": { name: "Product 1", column: "Product" },
  "CZP-001": { name: "Product 1", column: "Pack Size:" },
  "PFL-001": { name: "Product 1", column: "Pack Size:" },
  "NMX-001": { name: "Product 1", column: "Pack Size:" },
  "PFL-002": { name: "Product 1", column: "Pack Size:" },
  "FLX-002": { name: "Product 1", column: "Pack Size:" },
  "PFL-003": { name: "Product 1", column: "Pack Size:" },
  "PFL-004": { name: "Product 1", column: "Select Bundle" },
  "PFL-005": { name: "Product 1", column: "Pack Size:" },
};

const PRODUCT_CELL = ["Pack Size:", "Select Bundle", "Size"];

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
            if (PRODUCT_CELL.includes(cell.value)) {
              rowObj["Product"] = `${worksheet.name} ${
                row.getCell(colNumber).value
              }`;
            } else {
              rowObj[cell.value] = row.getCell(colNumber).value;
            }
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
