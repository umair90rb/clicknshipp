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

  async createOrderWebhookLogs(req, res) {
    try {
      const {limit, page, sort, status, from} = req.query;
      
      const query = {
        attributes: {
          exclude: ['payload'],
        },
        order: [['received_at', 'DESC']],
        limit: 100,
      };

      if (limit > -1) {
        query.limit = limit;
        if (page > 0) {
          query.offset = page * limit;
        }
      }
      if (sort && sort.length) {
        const order = sort.map((s) => [`${s.field}`, s.sort.toUpperCase()]);
        query.order = order;
      }
      if(status) {
        query.where = {status}
      }
      if(from) {
        query.where = {shop_domain: from, ...query.where}
      }
      const total = await ShopifyWebhookLog.count(query);
      const logs = await ShopifyWebhookLog.findAll(query);
      return sendSuccessResponse(res, 200, { logs, total });
    } catch (error) {
      console.error('Error fetching logs:', error);
      return sendErrorResponse(res, 500, error.message, null);
  
    }
  },
};
