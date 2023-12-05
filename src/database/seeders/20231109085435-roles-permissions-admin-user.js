"use strict";
import { hash } from "../../utils/hashing";
import model from "../../models";
import Constants from "../../utils/constants";

const { Role, Permission, User, UserRole, RolePermission } = model;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Role.bulkCreate([
      { name: Constants.ROLE_SUPER_ADMIN },
      { name: Constants.ROLE_ADMIN },
      { name: Constants.ROLE_MODERATOR },
      { name: Constants.ROLE_AUTHENTICATED },
    ]);

    await Permission.bulkCreate([
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
    ]);

    const superAdminUser = await User.create({
      name: "Super User",
      email: "super@example.com",
      password: hash("superuser"),
      phone: "+923051866823",
    });

    const superAdminRole = await Role.findOne({
      where: { name: Constants.ROLE_SUPER_ADMIN },
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
    await superAdminUser.addRole(superAdminRole);
    await superAdminRole.addPermissions(superAdminPermissions);
  },

  async down(queryInterface, Sequelize) {
    await Role.destroy({ truncate: true });
    await Permission.destroy({ truncate: true });
    await User.destroy({ truncate: true });
    await UserRole.destroy({ truncate: true });
    await RolePermission.destroy({ truncate: true });
  },
};
