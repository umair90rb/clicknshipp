import { Op, QueryTypes, literal, fn, col, Sequelize } from 'sequelize';
// import { sequelize } from '../models';
import model from '../models';
const { StockLevel, StockHistory } = model;

class StockService {
  constructor() {}

  async increment(item_type, item_id, by, location_id) {
    try {
      let stock = await StockLevel.findOne({
        where: { [Op.and]: [{ item_id }, { location_id }, { item_type }] },
      });
      if (stock) {
        stock = await stock.increment({ current_level: by });
      } else {
        stock = await StockLevel.create({
          current_level: by,
          item_id,
          location_id,
          item_type,
        });
      }
      return stock;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async decrement(item_type, item_id, by, location_id) {
    try {
      let stock = await StockLevel.findOne({
        where: { [Op.and]: [{ item_id }, { location_id }, { item_type }] },
      });
      if (stock) {
        stock = await stock.decrement({ current_level: by });
      } else {
        throw new Error('Stock not found!');
      }
      return stock;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createHistory(
    item_type,
    item_id,
    movement_type,
    location_id,
    quantity,
    comment = '',
    gate_pass_no = null,
    gate_pass_date = null
  ) {
    try {
      const history = await StockHistory.create({
        item_type,
        item_id,
        movement_type,
        location_id,
        quantity,
        comment,
        gate_pass_no,
        gate_pass_date,
      });
      return history;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async decreaseAndCreateHistory(
    item_type,
    item_id,
    movement_type,
    location_id,
    quantity,
    comment,
    gate_pass_no,
    gate_pass_date
  ) {
    return this.decrement(item_type, item_id, quantity, location_id).then(() =>
      this.createHistory(
        item_type,
        item_id,
        movement_type,
        location_id,
        quantity,
        comment,
        gate_pass_no,
        gate_pass_date
      )
    );
  }
}

const _stockService = new StockService();
export default _stockService;
