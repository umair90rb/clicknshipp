require('dotenv').config();
module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
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
    use_env_variable: 'DATABASE_URL',
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
    use_env_variable: 'DATABASE_URL',
    logging: true,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    timezone: '+05:00',
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
    },
  },
};
