import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const {
  Employee,
  EmployeeEducationHistory,
  EmployeeExperience,
  EmployeeImmediateContact,
  EmployeeAllowance,
} = model;

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
      const employee = await Employee.findByPk(id, { include: { all: true } });
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
      const salary = req.body.salary;
      let basic,
        house,
        conveyance,
        food,
        employeeData = { ...req.body };
      if (salary && salary > 0) {
        //gross salary 100000
        //66% basic
        //20% house allowance
        //4% conveyance allowance
        //10% food allowance
        basic = (salary * 66) / 100;
        house = (salary * 20) / 100;
        conveyance = (salary * 4) / 100;
        food = (salary * 10) / 100;
        employeeData = {
          ...req.body,
          salary: basic,
          allowances: [
            { amount: house, type: "House Allowance" },
            { amount: conveyance, type: "Conveyance Allowance" },
            { amount: food, type: "Food Allowance" },
          ],
        };
        let employee = await Employee.create(employeeData, {
          include: [{ model: EmployeeAllowance, as: "allowances" }],
        });
        return sendSuccessResponse(
          res,
          201,
          { employee },
          "Employee created successfully with allowances"
        );
      }
      let employee = await Employee.create(employeeData);
      return sendSuccessResponse(
        res,
        201,
        { employee },
        "Employee created successfully"
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

  async addEducation(req, res) {
    try {
      let educations = await EmployeeEducationHistory.bulkCreate(
        req.body.education
      );
      return sendSuccessResponse(
        res,
        201,
        { educations },
        "Employee educations added successfully"
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

  async addExperience(req, res) {
    try {
      let experiences = await EmployeeExperience.bulkCreate(
        req.body.experience
      );
      return sendSuccessResponse(
        res,
        201,
        { experiences },
        "Employee experiences added successfully"
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

  async addImmediateContact(req, res) {
    try {
      let contacts = await EmployeeImmediateContact.bulkCreate(
        req.body.contact
      );
      return sendSuccessResponse(
        res,
        201,
        { contacts },
        "Employee contacts added successfully"
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

  async addAllowance(req, res) {
    try {
      let allowances = await EmployeeAllowance.bulkCreate(req.body.allowance);
      return sendSuccessResponse(
        res,
        201,
        { allowances },
        "Employee allowances added successfully"
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
