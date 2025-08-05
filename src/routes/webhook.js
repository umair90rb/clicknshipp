import express from 'express';
import ShopifyWebhookController from '../controllers/ShopifyWebhookController';

const router = express.Router();

router.post(
  '/order/create',
  ShopifyWebhookController.createOrder
);


export default router;