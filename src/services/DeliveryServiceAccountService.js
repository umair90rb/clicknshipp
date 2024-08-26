import model from "../models";

const { DeliveryServiceAccounts, Tokens } = model;

class DeliverServiceAccountService {
  getAccountWithToken(id) {
    return DeliveryServiceAccounts.findByPk(id, {
      include: {
        model: Tokens,
        as: "tokens",
        attributes: ["token", "expiry", "type"],
      },
    });
  }
}

const deliveryServiceAccountService = new DeliverServiceAccountService();
export default deliveryServiceAccountService;
