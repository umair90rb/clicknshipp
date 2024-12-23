import { Op } from 'sequelize';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
const { Batch, Location, Item, RawMaterial } = model;

export default {
  async batches(req, res) {
    try {
      const batches = await Batch.findAll({
        attributes: ['id', 'batch_number', 'unit_of_measure', 'quantity'],
        include: [
          {
            model: Item,
            as: 'item',
            attributes: ['name', 'id'],
          },
          {
            model: RawMaterial,
            as: 'raw',
            attributes: ['name', 'id', 'unit_of_measure'],
          },
          {
            model: Location,
            as: 'location',
            attributes: ['name'],
          },
        ],
      });
      return sendSuccessResponse(res, 200, { batches }, 'All batches');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },

  async batch(req, res) {},

  async get(req, res) {
    try {
      const { location_id, ids, item_type } = req.body;
      const batches = await Batch.findAll({
        attributes: [
          'id',
          'batch_number',
          'unit_of_measure',
          'quantity',
          'item_id',
        ],
        where: {
          location_id,
          item_type,
          item_id: { [Op.in]: ids },
          quantity: { [Op.gt]: 0 },
        },
      });
      const batchObj = {};
      if (batches.length) {
        batches.map((b) => {
          batchObj[b.item_id] = [
            ...(Array.isArray(batchObj[b.item_id]) ? batchObj[b.item_id] : []),
            b,
          ];
        });
      }
      return sendSuccessResponse(
        res,
        200,
        { batches: batchObj },
        'All batches with ids'
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },

  async create(req, res) {},

  async update(req, res) {},

  async destroy(req, res) {},
};
