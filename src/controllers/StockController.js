import { Op } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import { hash } from "../utils/hashing";

const { Item, Brand, Category, StockLevel, StockHistory } = model;

export default {
  async stocks(req, res) {
    try {
      const stocks = await StockLevel.findAll({
        attributes: ["level"],
        include: [
          {
            model: Item,
            as: "item",
            attributes: ["name", "id"],
          },
        ],
      });
      return sendSuccessResponse(
        res,
        200,
        { stocks },
        "All items current stock"
      );
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
  async stock(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.findByPk(id, {
        attributes: ["level"],
        include: [
          {
            model: Item,
            as: "item",
            attributes: ["name", ["id", "item_id"]],
          },
        ],
      });
      if (item) {
        return sendSuccessResponse(
          res,
          200,
          { item },
          "Stock level of item with id"
        );
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
    const { item, level, expiry, comment } = req.body;
    try {
      let stock = await StockLevel.findOne({
        where: { item_id: item },
      });
      if (stock) {
        stock = await stock.increment({ level });
      } else {
        stock = await StockLevel.create({ level, item_id: item });
      }
      //stock history linked to stocklevel via stockId not with item id
      await StockHistory.create({
        amount: level,
        item_id: item,
        comment,
        expiry,
        type: "Stock added",
      });
      return sendSuccessResponse(
        res,
        201,
        {
          stock,
        },
        "Stock added successfully"
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

  async update(req, res) {},

  async destroy(req, res) {},
};
