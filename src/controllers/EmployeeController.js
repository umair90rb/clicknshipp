import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Employee } = model;

export default {
  async employees(req, res) {
    try {
      const employees = await Employee.findAll();
      return sendSuccessResponse(res, 200, { employees }, "All employees");
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
  async employee(req, res) {
    try {
      const { id } = req.params;
      const employee = await Employee.findByPk(id);
      if (employee) {
        return sendSuccessResponse(res, 200, { employee }, "Employee with id");
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
      let [employee, created] = await Employee.findOrCreate({
        where: { name },
        defaults: {
          name,
        },
      });
      return sendSuccessResponse(
        res,
        201,
        { employee },
        created ? "Employee created successfully" : "Existed employee"
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
      const employee = await Employee.findByPk(id);
      if (employee) {
        employee.set({
          name: name || employee.name,
        });
        await employee.save();

        return sendSuccessResponse(
          res,
          200,
          {
            employee,
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
      const employee = await Employee.findByPk(id);
      if (employee) {
        await employee.destroy();
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
