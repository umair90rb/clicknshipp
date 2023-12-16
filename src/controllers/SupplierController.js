import { Op } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import { hash } from "../utils/hashing";

const { Supplier } = model;

export default {
  async suppliers(req, res) {
    try {
      const suppliers = await Supplier.scope("clean").findAll();
      return sendSuccessResponse(
        res,
        200,
        { suppliers },
        "All registered suppliers"
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
  async supplier(req, res) {
    try {
      const { id } = req.params;
      const supplier = await Supplier.scope("clean").findByPk(id);
      if (supplier) {
        return sendSuccessResponse(res, 200, { supplier }, "Supplier with id");
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
    const { name, company, account_number, phone } = req.body;
    try {
      let supplier = await Supplier.findOne({
        where: { [Op.or]: [{ name }, { phone }] },
      });
      if (supplier) {
        return sendErrorResponse(
          res,
          422,
          "Supplier with name or phone already exists."
        );
      }
      supplier = await Supplier.create({
        name,
        phone,
        company,
        account_number,
      });
      return sendSuccessResponse(
        res,
        201,
        {
          supplier: {
            id: supplier.id,
            name: supplier.name,
            company: supplier.company,
            phone: supplier.phone,
            account_number: supplier.account_number,
          },
        },
        "Supplier created successfully"
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
      const { name, company, account_number, phone } = req.body;
      const supplier = await Supplier.findByPk(id);
      if (supplier) {
        supplier.set({
          name,
          phone,
          account_number,
          company,
          updatedAt: new Date().toISOString(),
        });
        await supplier.save();
        return sendSuccessResponse(
          res,
          200,
          {
            // can be supplier.get()
            supplier: {
              id: supplier.id,
              name: supplier.name,
              phone: supplier.phone,
              company: supplier.company,
              account_number: supplier.account_number,
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
      const supplier = await Supplier.findByPk(id);
      if (supplier) {
        await supplier.destroy();
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
