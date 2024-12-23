// src/swaggerConfig.js
import path from 'path';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API documentation of ERP',
  },
  servers: [
    {
      url: 'http://localhost:8080/api/v1',
    },
    {
      url: 'https://sukoon-inc-96f4d4ef3e58.herokuapp.com/api/v1',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, './routes/**/*.js')],
};

export default options;
