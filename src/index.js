import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import * as Sentry from '@sentry/node';
import route from './routes';
import logErrors from './middleware/logError';
import clientErrorHandler from './middleware/clientErrorHandler';
import errorHandler from './middleware/errorHandler';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './config/swagger.js';
import 'dotenv/config';
import './workers/bookingWorker';
import './workers/deliveryStatusSyncWorker';
import './workers/orderFulfillWorker.js';
import './jobs/assignOrders';
import './jobs/trackOrders';
import { dirname } from 'node:path';
const rootDir = dirname(process.argv[1]);
const swaggerSpec = swaggerJSDoc(swaggerConfig);

const app = express();

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, '../client', 'build')));

route(app);

Sentry.setupExpressErrorHandler(app);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log('App is now running at port ', process.env.PORT);
});
