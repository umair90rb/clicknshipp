import { Op } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import { hash } from "../utils/hashing";

const { Item, Category, Brand, Supplier } = model;

export default {
  async items(req, res) {
    try {
      const items = await Item.findAll({
        attributes: ["id", "name", "code", ["unit_price", "price"]],
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
          },
          {
            model: Brand,
            as: "brand",
            attributes: ["name"],
          },
          {
            model: Supplier,
            as: "supplier",
            attributes: ["name"],
          },
        ],
      });
      return sendSuccessResponse(res, 200, { items }, "All items");
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },
  async item(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.findByPk(id, {
        attributes: ["id", "code", "name", ["unit_price", "price"]],
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
          },
          {
            model: Brand,
            as: "brand",
            attributes: ["name"],
          },
          {
            model: Supplier,
            as: "supplier",
            attributes: ["name"],
          },
        ],
      });
      if (item) {
        return sendSuccessResponse(res, 200, { item }, "Item with id");
      }
      return sendErrorResponse(res, 404, "No data found with this id.");
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  async create(req, res) {
    const { name, code, unit_price, cost_price, supplier, category, brand } =
      req.body;
    try {
      let item = await Item.findOne({
        where: { [Op.or]: [{ name }, { code }] },
      });
      if (item) {
        return sendErrorResponse(
          res,
          422,
          "Item with name or code already exists."
        );
      }
      item = await Item.create({
        name,
        code,
        unit_price,
        cost_price,
      });
      await item.setCategory(category);
      await item.setBrand(brand);
      if (supplier) {
        await item.setSupplier(supplier);
      }
      await item.reload({
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["name"],
          },
          {
            model: Brand,
            as: "brand",
            attributes: ["name"],
          },
          {
            model: Supplier,
            as: "supplier",
            attributes: ["name"],
          },
        ],
      });
      return sendSuccessResponse(
        res,
        201,
        {
          item: {
            id: item.id,
            name: item.name,
            code: item.code,
            price: item.unit_price,
            category: item.category,
            brand: item.brand,
            supplier: item.supplier,
          },
        },
        "Item created successfully"
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        error
      );
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const { name, code, unit_price, cost_price, supplier, category, brand } =
        req.body;
      const item = await Item.findByPk(id);
      if (item) {
        item.set({
          name,
          code,
          unit_price,
          cost_price,
          updatedAt: new Date().toISOString(),
        });
        if (supplier) {
          await item.setSupplier(supplier);
        }
        if (brand) {
          await item.setBrand(brand);
        }
        if (category) {
          await item.setCategory(category);
        }
        await item.save();
        await item.reload({
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["name"],
            },
            {
              model: Brand,
              as: "brand",
              attributes: ["name"],
            },
            {
              model: Supplier,
              as: "supplier",
              attributes: ["name"],
            },
          ],
        });
        return sendSuccessResponse(
          res,
          200,
          {
            item: {
              id: item.id,
              name: item.name,
              code: item.code,
              price: item.unit_price,
              category: item.category,
              brand: item.brand,
              supplier: item.supplier,
            },
          },
          "Operation successful"
        );
      }
      return sendErrorResponse(res, 404, "No data found with this id");
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later",
        e
      );
    }
  },

  async destroy(req, res) {
    try {
      const id = req.params.id;
      const item = await Item.findByPk(id);
      if (item) {
        await item.destroy();
        return sendSuccessResponse(res, 200, {}, "Operation successful.");
      }
      return sendErrorResponse(res, 404, "No data found with this id.");
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },
};
