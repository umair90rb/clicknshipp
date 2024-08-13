import Joi from "joi";

const createUpdateEmployeeSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().allow(""),
  phone: Joi.number().required(),
  hire_at: Joi.string().required(),
  department_id: Joi.number().required(),
  designation_id: Joi.number().required(),
  salary: Joi.number().required(),
});

const addUpdateEmployeePicture = Joi.object({
  employee_id: Joi.number().required(),
});

const createUpdateEmployeeEducationSchema = Joi.object({
  education: Joi.array()
    .min(1)
    .items(
      Joi.object({
        id: Joi.number(),
        createdAt: Joi.string(),
        updatedAt: Joi.string(),
        employee_id: Joi.number().required(),
        degree: Joi.string().required(),
        started_at: Joi.string().required(),
        ended_at: Joi.string().required(),
        obtained: Joi.number().required(),
        total: Joi.number().required(),
      })
    ),
});

const createUpdateEmployeeExperienceSchema = Joi.object({
  experience: Joi.array()
    .min(1)
    .items(
      Joi.object({
        employee_id: Joi.number().required(),
        company: Joi.string().required(),
        started_at: Joi.string().required(),
        ended_at: Joi.string().required(),
        designation: Joi.string().required(),
        id: Joi.number(),
        createdAt: Joi.string(),
        updatedAt: Joi.string(),
      })
    ),
});

const createUpdateEmployeeImmediateContactSchema = Joi.object({
  contact: Joi.array()
    .min(1)
    .items(
      Joi.object({
        employee_id: Joi.number().required(),
        name: Joi.string().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        relation: Joi.string().required(),
        id: Joi.number(),
        createdAt: Joi.string(),
        updatedAt: Joi.string(),
      })
    ),
});

const createUpdateEmployeeAllowanceSchema = Joi.object({
  allowance: Joi.array()
    .min(1)
    .items(
      Joi.object({
        employee_id: Joi.number().required(),
        type: Joi.string().required(),
        amount: Joi.number().required(),
        id: Joi.number(),
        createdAt: Joi.string(),
        updatedAt: Joi.string(),
      })
    ),
});

export {
  createUpdateEmployeeSchema,
  addUpdateEmployeePicture,
  createUpdateEmployeeEducationSchema,
  createUpdateEmployeeExperienceSchema,
  createUpdateEmployeeImmediateContactSchema,
  createUpdateEmployeeAllowanceSchema,
};
