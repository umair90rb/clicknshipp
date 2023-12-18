import { Op, Sequelize } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Brand, Item } = model;

export default {
  async brands(req, res) {
    try {
      const brands = await Brand.scope("clean").findAll({
        attributes: {
          include: [
            [Sequelize.fn("COUNT", Sequelize.col("items.id")), "itemCount"],
          ],
        },
        include: [
          {
            model: Item,
            as: "items",
            attributes: [],
          },
        ],
        group: ["Brand.id"],
      });
      return sendSuccessResponse(res, 200, { brands }, "All brands");
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
  async brand(req, res) {
    try {
      const { id } = req.params;
      const brand = await Brand.scope("clean").findByPk(id);
      if (brand) {
        return sendSuccessResponse(res, 200, { brand }, "Brand with id");
      }
      return sendErrorResponse(res, 404, "No data found with this id");
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
    const { name } = req.body;
    try {
      let brand = await Brand.findOne({
        where: { name },
      });
      if (brand) {
        return sendErrorResponse(res, 422, "Brand with name already exists.");
      }
      brand = await Brand.create({
        name,
      });
      return sendSuccessResponse(
        res,
        201,
        {
          brand: {
            id: brand.id,
            name: brand.name,
          },
        },
        "Brand created successfully"
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
      const { name } = req.body;
      const brand = await Brand.findByPk(id);
      if (brand) {
        brand.set({
          name,
          updatedAt: new Date().toISOString(),
        });
        await brand.save();
        return sendSuccessResponse(
          res,
          200,
          {
            brand: {
              id: brand.id,
              name: brand.name,
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
      const brand = await Brand.findByPk(id);
      if (brand) {
        await brand.destroy();
        return sendSuccessResponse(res, 200, {}, "Operation successful");
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
};
