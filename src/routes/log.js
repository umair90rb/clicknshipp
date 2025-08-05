import express from 'express';

import LogController from '../controllers/LogController';

const router = express.Router();

router.get('/', LogController.logs);
router.get('/:file', LogController.log);
router.get('/webhook/order/create', LogController.createOrderWebhook);


router.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});


export default router;
