import model from "../models";
import { Op } from "sequelize";
const {
  Order,
  OrderItem,
  Customer,
  Address,
  User,
  Chanel,
  Payments,
  Brand,
  DeliveryServiceAccounts,
  Delivery,
} = model;

class OrderService {
  constructor() {}

  async createSubmissionOrder(_order, userId) {
    try {
      const {
        order: orderData,
        items: itemsData,
        address: addressData,
        customer: customerData,
      } = _order;
      console.log(customerData);
      const order = await Order.create(orderData);
      const address = await order.createAddress(addressData);
      let [customer, created] = await Customer.findOrCreate({
        where: { phone: customerData.phone },
        defaults: {
          phone: customerData.phone,
          first_name: customerData.name,
        },
      });
      if (!created && customer?.first_name === null) {
        await customer.update({ first_name: customerData.name });
      }
      await order.setCustomer(customer.id);
      await address.setCustomer(customer.id);
      const itemsArray = await OrderItem.bulkCreate(itemsData);
      await order.addItems(itemsArray);
      await order.createHistory({
        user_id: userId,
        event: "order created via submission file upload",
      });
      await order.reload();
      return order;
    } catch (error) {
      console.log(error, "error in create submission order in order service");
      return error.message;
    }
  }

  async loadFullOrder(id) {}

  async findDuplicateOrder(order) {}

  async findOrdersBy(
    tag,
    query,
    orderFields = ["id", "order_number", "status", "createdAt"]
  ) {
    try {
      const sqlQuery = {
        attributes: orderFields,
        where:
          tag === "Order Number"
            ? {
                order_number: query,
              }
            : undefined,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name"],
          },
          {
            model: Customer,
            as: "customer",
            attributes: ["first_name", "last_name", "name"],
            where:
              tag === "Phone"
                ? {
                    phone: query,
                  }
                : undefined,
          },
          {
            model: OrderItem,
            as: "items",
            attributes: ["id", "name", "quantity"],
            where:
              tag === "Item"
                ? {
                    name: {
                      [Op.iLike]: query,
                    },
                  }
                : undefined,
          },
        ],
      };
      const orders = await Order.findAll(sqlQuery);
      return orders;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export const _orderService = new OrderService();
export default _orderService;
