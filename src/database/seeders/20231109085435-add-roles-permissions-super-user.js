"use strict";
import { hash } from "../../utils/hashing";
import model from "../../models";
import { ROLES, PERMISSIONS } from "../../constants/constants";

const { Role, Permission, User } = model;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // create all permissions
    await Permission.bulkCreate(
      Object.values(PERMISSIONS).map((permission) => ({ name: permission })),
      { ignoreDuplicates: true }
    );
    const permissions = await Permission.findAll({
      where: {
        name: Object.values(PERMISSIONS).map((permission) => permission),
      },
    });
    // create super admin role
    const [superAdminRole] = await Role.findOrCreate({
      where: { name: ROLES.ROLE_SUPER_ADMIN },
      defaults: {
        name: ROLES.ROLE_SUPER_ADMIN,
      },
    });
    //give all permissions to super admin role
    await superAdminRole.setPermissions(null);
    await superAdminRole.setPermissions(permissions);

    const [superAdminUser] = await User.findOrCreate({
      where: { email: "super@example.com" },
      defaults: {
        name: "Super User",
        email: "super@example.com",
        password: hash("superuser"),
        phone: "+923051866823",
      },
    });

    if (!(await superAdminUser.hasRole(superAdminRole))) {
      await superAdminUser.addRole(superAdminRole);
    }
  },

  async down(queryInterface, Sequelize) {
    const superUser = await User.findOne({
      where: { email: "super@example.com" },
    });
    if (superUser) {
      await superUser.setRoles(null);
      await superUser.destroy({ truncate: true });
    }
    const superAdminRole = await Role.findOne({
      where: {
        name: ROLES.ROLE_SUPER_ADMIN,
      },
    });
    if (superAdminRole) {
      await superAdminRole.setPermissions(null);
      await superAdminRole.destroy({ truncate: true });
    }
    await Permission.destroy(
      {
        where: {
          name: Object.values(PERMISSIONS).map((permission) => ({
            name: permission,
          })),
        },
      },
      { truncate: true }
    );
  },
};
