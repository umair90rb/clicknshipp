import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Allowance } = model;

export default {
  async allowances(req, res) {
    try {
      const allowances = await Allowance.findAll();
      return sendSuccessResponse(res, 200, { allowances }, "All allowances");
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
  async allowance(req, res) {
    try {
      const { id } = req.params;
      const allowance = await Allowance.findByPk(id);
      if (allowance) {
        return sendSuccessResponse(
          res,
          200,
          { allowance },
          "Allowance with id"
        );
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
    try {
      const { name } = req.body;
      let [allowance, created] = await Allowance.findOrCreate({
        where: { name },
        defaults: {
          name,
        },
      });
      return sendSuccessResponse(
        res,
        201,
        { allowance },
        created ? "Allowance created successfully" : "Existed allowance"
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
      const allowance = await Allowance.findByPk(id);
      if (allowance) {
        allowance.set({
          name: name || allowance.name,
        });
        await allowance.save();

        return sendSuccessResponse(
          res,
          200,
          {
            allowance,
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
      const allowance = await Allowance.findByPk(id);
      if (allowance) {
        await allowance.destroy();
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
