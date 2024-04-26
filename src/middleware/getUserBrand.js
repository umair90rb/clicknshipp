import { sendErrorResponse } from "../utils/sendResponse";
import model from "../models";

const { User, Brand } = model;

export default async (req, res, next) => {
  try {
    if (!req.user.id) {
      next();
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ["id"],
      include: [
        {
          model: Brand,
          as: "brands",
          attributes: ["id", "name"],
        },
      ],
    });

    req.user = { ...req.user, brands: user.brands };
    next();
  } catch (e) {
    console.error(e);
    return sendErrorResponse(res, 401, "Authentication Failed", e);
  }
};
