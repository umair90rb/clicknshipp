import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Designation } = model;

export default {
  async designations(req, res) {
    try {
      const designations = await Designation.findAll();
      return sendSuccessResponse(
        res,
        200,
        { designations },
        "All designations"
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
  async designation(req, res) {
    try {
      const { id } = req.params;
      const designation = await Designation.findByPk(id);
      if (designation) {
        return sendSuccessResponse(
          res,
          200,
          { designation },
          "Designation with id"
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
      let [designation, created] = await Designation.findOrCreate({
        where: { name },
        defaults: {
          name,
        },
      });
      return sendSuccessResponse(
        res,
        201,
        { designation },
        created ? "Designation created successfully" : "Existed designation"
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
      const designation = await Designation.findByPk(id);
      if (designation) {
        designation.set({
          name: name || designation.name,
        });
        await designation.save();

        return sendSuccessResponse(
          res,
          200,
          {
            designation,
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
      const designation = await Designation.findByPk(id);
      if (designation) {
        await designation.destroy();
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
