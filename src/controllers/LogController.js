import fs from 'fs/promises';
import path from 'path';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
const rootDir = path.dirname(process.argv[1]);

const { ShopifyWebhookLog } = model;

export default {
  async logs(req, res) {
    try {
      const dirLs = await fs.readdir(path.join(rootDir, '/logs/'));
      const files = Object.values(dirLs).filter((file) =>
        file.endsWith('.log')
      );
      console.log(rootDir, files);
      return sendSuccessResponse(res, 200, { files });
    } catch (error) {
      return sendErrorResponse(res, 500, error.message, error);
    }
  },
  async log(req, res) {
    try {
      const file = req.params.file;
      return res.sendFile(path.join(rootDir, '/logs/', file));
    } catch (error) {
      return sendErrorResponse(res, 500, error.message, error);
    }
  },

  async createOrderWebhook(req, res) {
    try {
      const logs = await ShopifyWebhookLog.findAll({
        attributes: {
          exclude: ['payload'],
        },
        order: [['received_at', 'DESC']],
        limit: 100,
      });
      return sendSuccessResponse(res, 200, { logs });
    } catch (error) {
      console.error('Error fetching logs:', error);
      return sendErrorResponse(res, 500, error.message, null);
  
    }
  },
};
