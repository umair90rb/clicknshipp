import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Department } = model;

export default {
  async departments(req, res) {
    try {
      const departments = await Department.findAll();
      return sendSuccessResponse(res, 200, { departments }, "All departments");
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
  async department(req, res) {
    try {
      const { id } = req.params;
      const department = await Department.findByPk(id);
      if (department) {
        return sendSuccessResponse(
          res,
          200,
          { department },
          "Department with id"
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
      let [department, created] = await Department.findOrCreate({
        where: { name },
        defaults: {
          name,
        },
      });
      return sendSuccessResponse(
        res,
        201,
        { department },
        created ? "Department created successfully" : "Existed department"
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
      const department = await Department.findByPk(id);
      if (department) {
        department.set({
          name: name || department.name,
        });
        await department.save();

        return sendSuccessResponse(
          res,
          200,
          {
            department,
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
      const department = await Department.findByPk(id);
      if (department) {
        await department.destroy();
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
