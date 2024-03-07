"use strict";
import { hash } from "../../utils/hashing";
import model from "../../models";
import Constants from "../../utils/constants";

const { Role, Permission, User, UserRole, RolePermission } = model;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [superAdminRole] = await Role.findOrCreate({
      where: { name: Constants.ROLE_SUPER_ADMIN },
      defaults: {
        name: Constants.ROLE_SUPER_ADMIN,
      },
    });
    await Permission.bulkCreate(
      [
        {
          name: Constants.PERMISSION_VIEW_ADMIN_DASHBOARD,
        },
        {
          name: Constants.PERMISSION_VIEW_ALL_USERS,
        },
        {
          name: Constants.PERMISSION_CREATE_USER,
        },
        {
          name: Constants.PERMISSION_UPDATE_USER,
        },
        {
          name: Constants.PERMISSION_DELETE_USER,
        },
        {
          name: Constants.PERMISSION_VIEW_ALL_ROLES,
        },
        {
          name: Constants.PERMISSION_CREATE_ROLE,
        },
        {
          name: Constants.PERMISSION_UPDATE_ROLE,
        },
        {
          name: Constants.PERMISSION_DELETE_ROLE,
        },
        {
          name: Constants.PERMISSION_VIEW_ALL_ORDERS,
        },
        {
          name: Constants.PERMISSION_CREATE_ORDER,
        },
        {
          name: Constants.PERMISSION_UPDATE_ORDER,
        },
        {
          name: Constants.PERMISSION_DELETE_ORDER,
        },
      ],
      { ignoreDuplicates: true }
    );
    const [superAdminUser] = await User.findOrCreate({
      where: { email: "super@example.com" },
      defaults: {
        name: "Super User",
        email: "super@example.com",
        password: hash("superuser"),
        phone: "+923051866823",
      },
    });
    const superAdminPermissions = await Permission.findAll({
      where: {
        name: [
          Constants.PERMISSION_VIEW_ADMIN_DASHBOARD,
          Constants.PERMISSION_VIEW_ALL_USERS,
          Constants.PERMISSION_CREATE_USER,
          Constants.PERMISSION_UPDATE_USER,
          Constants.PERMISSION_DELETE_USER,
          Constants.PERMISSION_VIEW_ALL_ROLES,
          Constants.PERMISSION_CREATE_ROLE,
          Constants.PERMISSION_UPDATE_ROLE,
          Constants.PERMISSION_DELETE_ROLE,
          Constants.PERMISSION_VIEW_ALL_ORDERS,
          Constants.PERMISSION_CREATE_ORDER,
          Constants.PERMISSION_UPDATE_ORDER,
          Constants.PERMISSION_DELETE_ORDER,
        ],
      },
    });
    await superAdminRole.addPermissions(superAdminPermissions, {
      ignoreDuplicates: true,
    });
    if (!(await superAdminUser.hasRole(superAdminRole))) {
      await superAdminUser.addRole(superAdminRole);
    }
  },

  async down(queryInterface, Sequelize) {
    const superAdminRole = await Role.findOne({
      where: {
        name: Constants.ROLE_SUPER_ADMIN,
      },
    });
    if (superAdminRole) {
      await superAdminRole.setPermissions(null);
    }
    await Permission.destroy({
      where: {
        name: [
          Constants.PERMISSION_VIEW_ADMIN_DASHBOARD,
          Constants.PERMISSION_VIEW_ALL_USERS,
          Constants.PERMISSION_CREATE_USER,
          Constants.PERMISSION_UPDATE_USER,
          Constants.PERMISSION_DELETE_USER,
          Constants.PERMISSION_VIEW_ALL_ROLES,
          Constants.PERMISSION_CREATE_ROLE,
          Constants.PERMISSION_UPDATE_ROLE,
          Constants.PERMISSION_DELETE_ROLE,
          Constants.PERMISSION_VIEW_ALL_ORDERS,
          Constants.PERMISSION_CREATE_ORDER,
          Constants.PERMISSION_UPDATE_ORDER,
          Constants.PERMISSION_DELETE_ORDER,
        ],
      },
    });
    const superUser = await User.findOne({
      where: { email: "super@example.com" },
      truncate: true,
    });
    await superUser.setRoles(null);
    if (superAdminRole) {
      await superAdminRole.destroy();
    }
  },
};
