import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import Sequelize, { DataTypes } from 'sequelize';
const basename = _basename(__filename);
const config = require(__dirname + '/../config/db.js')[process.env.NODE_ENV];
const db = {};

let sequelize = new Sequelize(process.env[config.use_env_variable], config);

readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
export { sequelize, Sequelize };
export default db;
