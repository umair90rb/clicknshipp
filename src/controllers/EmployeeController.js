import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const {
  Department,
  Designation,
  Employee,
  EmployeeEducationHistory,
  EmployeeExperience,
  EmployeeImmediateContact,
  EmployeeAllowance,
  EmployeeIncrementHistory,
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
      const employee = await Employee.findByPk(id, {
        attributes: [
          "id",
          "name",
          "phone",
          "email",
          "hire_at",
          "picture",
          "salary",
        ],
        include: [
          { model: Department, as: "department", attributes: ["id", "name"] },
          { model: Designation, as: "designation", attributes: ["id", "name"] },
          {
            model: EmployeeEducationHistory,
            as: "education",
            attributes: {
              exclude: ["id", "createdAt", "updatedAt"],
            },
          },
          {
            model: EmployeeExperience,
            as: "experiences",
            attributes: {
              exclude: ["id", "createdAt", "updatedAt"],
            },
          },
          {
            model: EmployeeImmediateContact,
            as: "contacts",
            attributes: {
              exclude: ["id", "createdAt", "updatedAt"],
            },
          },
          {
            model: EmployeeAllowance,
            as: "allowances",
            attributes: {
              exclude: ["id", "created_at", "updated_at"],
            },
          },
          {
            model: EmployeeIncrementHistory,
            as: "increments",
            attributes: {
              exclude: ["id", "createdAt", "updatedAt"],
            },
          },
        ],
      });
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
        //gross salary 10000
        //66% basic
        //20% house allowance
        //4% conveyance allowance
        //10% food allowance
        house = (salary * (20 / 100)).toFixed(2);
        conveyance = (salary * (4 / 100)).toFixed(2);
        food = (salary * (10 / 100)).toFixed(2);
        basic = (salary * (66 / 100)).toFixed(2);
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

  async addPicture(req, res) {
    try {
      const employee = await Employee.findByPk(req.body.employee_id, {
        attributes: ["id", "picture"],
      });
      if (employee.picture !== null) {
        console.log("====================", employee.picture);
      }

      await Employee.update(
        {
          picture: req.file.location,
        },
        { where: { id: req.body.employee_id } }
      );
      return sendSuccessResponse(
        res,
        201,
        { picture: req.file.location },
        "Employee picture added successfully"
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
      await EmployeeEducationHistory.destroy({
        where: {
          employee_id: req.body.education[0].employee_id,
        },
      });
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
      await EmployeeExperience.destroy({
        where: { employee_id: req.body.experience[0].employee_id },
      });
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
      await EmployeeImmediateContact.destroy({
        where: { employee_id: req.body.contact[0].employee_id },
      });
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
      await EmployeeAllowance.destroy({
        where: { employee_id: req.body.allowance[0].employee_id },
      });
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
        await EmployeeEducationHistory.destroy({
          where: { employee_id: employee.id },
        });
        await EmployeeExperience.destroy({
          where: { employee_id: employee.id },
        });
        await EmployeeImmediateContact.destroy({
          where: { employee_id: employee.id },
        });
        await EmployeeAllowance.destroy({
          where: { employee_id: employee.id },
        });
        await EmployeeIncrementHistory.destroy({
          where: { employee_id: employee.id },
        });
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
