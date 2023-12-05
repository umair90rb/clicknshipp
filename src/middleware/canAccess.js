import { sendErrorResponse } from "../utils/sendResponse";
import model from "../models";

const { Role, Permission } = model;

export default (permission) => async (req, res, next) => {
  const access = await Permission.findOne({
    where: { name: permission },
    include: [
      {
        attributes: ["id", "name"],
        model: Role,
        as: "roles",
        through: { attributes: [] },
      },
    ],
  });
  if (await req.user.hasPermissionTo(access)) {
    return next();
  }
  console.error("Insufficient Permissions.");
  return sendErrorResponse(res, 403, "Insufficient Permissions.");
};
