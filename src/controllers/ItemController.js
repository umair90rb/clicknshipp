import { Op } from 'sequelize';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import excelToJson from '../helpers/excelToJson';

const { Item, Category, Brand, Supplier } = model;

export default {
  async items(req, res) {
    try {
      const items = await Item.findAll({
        attributes: [
          'id',
          'name',
          'code',
          'unit_of_measure',
          'unit_price',
          'cost_price',
        ],
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
          {
            model: Brand,
            as: 'brand',
            attributes: ['id', 'name'],
          },
          {
            model: Supplier,
            as: 'supplier',
            attributes: ['id', 'name'],
          },
        ],
      });
      return sendSuccessResponse(res, 200, { items }, 'All items');
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
  async item(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.findByPk(id, {
        attributes: ['id', 'code', 'name', ['unit_price', 'price']],
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
          {
            model: Brand,
            as: 'brand',
            attributes: ['id', 'name'],
          },
          {
            model: Supplier,
            as: 'supplier',
            attributes: ['id', 'name'],
          },
        ],
      });
      if (item) {
        return sendSuccessResponse(res, 200, { item }, 'Item with id');
      }
      return sendErrorResponse(res, 404, 'No data found with this id.');
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

  async create(req, res) {
    const {
      name,
      code,
      unit_price,
      unit_of_measure,
      cost_price,
      incentive,
      supplier,
      category,
      brand,
    } = req.body;
    try {
      let item = await Item.findOne({
        attributes: ['id'],
        where: { [Op.or]: [{ name }, { code }] },
      });
      if (item) {
        return sendErrorResponse(
          res,
          422,
          'Item with name or code already exists.'
        );
      }
      item = await Item.create({
        name,
        code,
        unit_price,
        cost_price,
        incentive,
        unit_of_measure,
        category_id: category,
        brand_id: brand,
        ...(supplier ? { supplier_id: supplier } : {}),
      });
      await item.reload({
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
          {
            model: Brand,
            as: 'brand',
            attributes: ['id', 'name'],
          },
          {
            model: Supplier,
            as: 'supplier',
            attributes: ['id', 'name'],
          },
        ],
      });
      return sendSuccessResponse(
        res,
        201,
        {
          item,
        },
        'Item created successfully'
      );
    } catch (error) {
      console.log(error.message, error.stack);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        error
      );
    }
  },

  async import(req, res) {
    try {
      const json = await excelToJson(req.file.buffer);
      const nameWithSKUAndVolume = json.map((item) => {
        const itemCopy = { ...item };
        const { sku, volume } = itemCopy;
        if (volume && volume !== '') {
          itemCopy.name += ` (${volume})`;
        }
        if (sku && sku !== '') {
          itemCopy.name += ` ${sku}`;
        }
        itemCopy.code = sku || '';
        delete itemCopy.volume;
        delete itemCopy.sku;
        return itemCopy;
      });
      await Item.bulkCreate(nameWithSKUAndVolume);
      return sendSuccessResponse(res, 200, {}, 'Items imported successfully!');
    } catch (error) {
      console.error(error);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        error
      );
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const {
        name,
        code,
        unit_price,
        cost_price,
        incentive,
        unit_of_measure,
        supplier,
        category,
        brand,
      } = req.body;
      const item = await Item.findByPk(id);
      if (item) {
        await item.update({
          name,
          code,
          unit_price,
          cost_price,
          incentive,
          unit_of_measure,
          updatedAt: new Date().toISOString(),
          ...(supplier ? { supplier_id: supplier } : {}),
          ...(brand ? { brand_id: brand } : {}),
          ...(category ? { category_id: category } : {}),
        });
        await item.reload({
          include: [
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'name'],
            },
            {
              model: Brand,
              as: 'brand',
              attributes: ['id', 'name'],
            },
            {
              model: Supplier,
              as: 'supplier',
              attributes: ['id', 'name'],
            },
          ],
        });
        return sendSuccessResponse(
          res,
          200,
          {
            item,
          },
          'Operation successful'
        );
      }
      return sendErrorResponse(res, 404, 'No data found with this id');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later',
        e
      );
    }
  },

  async destroy(req, res) {
    try {
      const id = req.params.id;
      console.log(Item.rawAttributes);
      const item = await Item.findByPk(id);
      if (item) {
        await item.destroy();
        return sendSuccessResponse(res, 200, {}, 'Operation successful.');
      }
      return sendErrorResponse(res, 404, 'No data found with this id.');
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
};
