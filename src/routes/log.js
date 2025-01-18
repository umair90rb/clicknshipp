import express from 'express';

import LogController from '../controllers/LogController';

const router = express.Router();

router.get('/', LogController.logs);

router.get('/sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

router.get('/:file', LogController.log);

export default router;
