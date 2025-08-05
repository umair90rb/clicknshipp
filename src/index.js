import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { dirname } from 'node:path';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import './config/instrument.js';
import swaggerConfig from './config/swagger.js';
import './jobs/assignOrders';
import './jobs/trackOrders';
import clientErrorHandler from './middleware/clientErrorHandler';
import errorHandler from './middleware/errorHandler';
import logErrors from './middleware/logError';
import route from './routes';
import './workers/bookingWorker';
import './workers/deliveryStatusSyncWorker';
import './workers/orderFulfillWorker.js';
import './workers/orderProcessingWorker.js';
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
