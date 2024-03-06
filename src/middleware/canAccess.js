import { sendErrorResponse } from "../utils/sendResponse";
import model from "../models";

const { User, Role, Permission } = model;

export default (requiredPermission) => async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ["id"],
    include: [
      {
        model: Role,
        as: "roles",
        attributes: ["id", "name"],
        include: [
          {
            model: Permission,
            as: "permissions",
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  const userRoles = [];
  const userPermissions = [];
  user.roles.forEach((role) => {
    userRoles.push(role.name);
    userPermissions.push(
      ...role.permissions.map((permission) => permission.name)
    );
  });
  let hasPermission = false;
  console.log(Array.isArray(requiredPermission));
  if (Array.isArray(requiredPermission)) {
    requiredPermission.forEach((rp, index) => {
      console.log(rp, index, userPermissions.includes(rp));
      if (userPermissions.includes(rp)) {
        hasPermission = true;
        return;
      }
    });
  } else if (userPermissions.includes(requiredPermission)) {
    hasPermission = true;
  }
  console.log(
    "user permissions:",
    userPermissions,
    "has permission to ",
    requiredPermission,
    hasPermission
  );
  if (hasPermission) {
    req.user.roles = userRoles;
    req.user.permissions = userPermissions;
    return next();
  }
  console.error("Insufficient Permissions.");
  return sendErrorResponse(res, 403, "Insufficient Permissions.");
};
