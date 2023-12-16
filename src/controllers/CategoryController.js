import { Op } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Category } = model;

export default {
  async categories(req, res) {
    try {
      const categories = await Category.scope("clean").findAll();
      return sendSuccessResponse(res, 200, { categories }, "All categories");
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
  async category(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.scope("clean").findByPk(id);
      if (category) {
        return sendSuccessResponse(res, 200, { category }, "Category with id");
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
      let category = await Category.findOne({
        where: { name },
      });
      if (category) {
        return sendErrorResponse(
          res,
          422,
          "Category with name already exists."
        );
      }
      category = await Category.create({
        name,
      });
      return sendSuccessResponse(
        res,
        201,
        {
          category: {
            id: category.id,
            name: category.name,
          },
        },
        "Category created successfully"
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
      const category = await Category.findByPk(id);
      if (category) {
        category.set({
          name,
          updatedAt: new Date().toISOString(),
        });
        await category.save();
        return sendSuccessResponse(
          res,
          200,
          {
            category: {
              id: category.id,
              name: category.name,
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
      const category = await Category.findByPk(id);
      if (category) {
        await category.destroy();
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
