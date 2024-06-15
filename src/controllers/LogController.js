import path from "path";
import fs from "fs/promises";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
const rootDir = path.dirname(process.argv[1]);

export default {
  async logs(req, res) {
    try {
      const dirLs = await fs.readdir(path.join(rootDir, "/logs/"));
      const files = Object.values(dirLs).filter((file) =>
        file.endsWith(".log")
      );
      console.log(files);
      return sendSuccessResponse(res, 200, { files });
    } catch (error) {
      return sendErrorResponse(res, 500, error.message, error);
    }
  },
  async log(req, res) {
    try {
      const file = req.params.file;
      return res.sendFile(path.join(rootDir, "logs", file));
    } catch (error) {
      return sendErrorResponse(res, 500, error.message, error);
    }
  },
};
