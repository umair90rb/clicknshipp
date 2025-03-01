require('dotenv').config();
module.exports = {
  development: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    timezone: '+05:00',
    ...(process.env.NODE_ENV === 'production' && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),
  },
  test: {
    use_env_variable: process.env.DATABASE_URL,
    logging: false,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    timezone: '+05:00',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    use_env_variable: process.env.DATABASE_URL,
    logging: false,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    timezone: '+05:00',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
