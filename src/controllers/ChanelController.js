import { Op, Sequelize } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Chanel, Brand } = model;

export default {
  async chanels(req, res) {
    try {
      const chanels = await Chanel.scope("clean").findAll({
        attributes: ["id", "name", "source"],
        include: { model: Brand, as: "brand", attributes: ["id", "name"] },
      });
      return sendSuccessResponse(res, 200, { chanels }, "All sales chanels");
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
  async chanel(req, res) {
    try {
      const { id } = req.params;
      const chanel = await Chanel.scope("clean").findByPk(id, {
        attributes: ["id", "name", "source"],
        include: { model: Brand, as: "brand", attributes: ["id", "name"] },
      });
      if (chanel) {
        return sendSuccessResponse(res, 200, { chanel }, "Chanel with id");
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
    const { name, source, brand_id } = req.body;
    try {
      let chanel = await Chanel.findOne({
        where: { name },
      });
      if (chanel) {
        return sendErrorResponse(res, 422, "Chanel with name already exists.");
      }
      chanel = await Chanel.create({
        name,
        source,
        brand_id,
      });
      await chanel.reload({
        attributes: ["id", "name", "source"], // not working as expected. need to figure out how to exclude unnecessary fields from chanel.reload
        include: { model: Brand, as: "brand", attributes: ["id", "name"] },
      });
      return sendSuccessResponse(
        res,
        201,
        {
          chanel: chanel.get(),
        },
        "Chanel created successfully"
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
      const { name, source, brand_id } = req.body;
      const chanel = await Chanel.findByPk(id);
      if (chanel) {
        chanel.set({
          name,
          source,
          brand_id,
          updatedAt: new Date().toISOString(),
        });
        await chanel.save();
        await chanel.reload({
          attributes: ["id", "name", "source"], // not working as expected. need to figure out how to exclude unnecessary fields from chanel.reload
          include: { model: Brand, as: "brand", attributes: ["id", "name"] },
        });
        return sendSuccessResponse(
          res,
          200,
          {
            chanel: chanel.get(),
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
      const chanel = await Chanel.findByPk(id);
      if (chanel) {
        await chanel.destroy();
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
