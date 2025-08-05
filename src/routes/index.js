import express from 'express';
import path from 'path';
import admin from './admin';
import allowance from './allowance';
import auth from './auth';
import batch from './batch';
import bom from './billOfMaterial';
import brand from './brand';
import category from './category';
import chanel from './chanel';
import city from './city';
import customer from './customer';
import dashboard from './dashboard';
import deliverServiceAccounts from './deliverServiceAccounts';
import department from './department';
import designation from './designation';
import employee from './employee';
import item from './item';
import location from './location';
import log from './log';
import notification from './notification';
import order from './order';
import permission from './permission';
import rawMaterial from './rawMaterial';
import report from './report';
import role from './role';
import salesOrder from './salesOrder';
import search from './search';
import stock from './stock';
import supplier from './supplier';
import uom from './unitOfMeasure';
import user from './user';
import webhook from './webhook';

const rootDir = path.dirname(process.argv[1]);

export default (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get('/api/v1/health', (req, res) => {
    res.status(200).send('ok');
  });

  app.use('/api/v1/auth', auth);
  app.use('/api/v1/user', user);
  app.use('/api/v1/item', item);
  app.use('/api/v1/stock', stock);
  app.use('/api/v1/batch', batch);
  app.use('/api/v1/bom', bom);
  app.use('/api/v1/sales-order', salesOrder);
  app.use('/api/v1/location', location);
  app.use('/api/v1/uom', uom);
  app.use('/api/v1/raw-material', rawMaterial);
  app.use('/api/v1/supplier', supplier);
  app.use('/api/v1/category', category);
  app.use('/api/v1/brand', brand);
  app.use('/api/v1/department', department);
  app.use('/api/v1/designation', designation);
  app.use('/api/v1/employee', employee);
  app.use('/api/v1/allowance', allowance);
  app.use('/api/v1/chanel', chanel);
  app.use('/api/v1/customer', customer);
  app.use('/api/v1/role', role);
  app.use('/api/v1/city', city);
  app.use('/api/v1/notification', notification);
  app.use('/api/v1/permission', permission);
  app.use('/api/v1/order', order);
  app.use('/api/v1/webhook', webhook)
  //[baseURL]/api/v1/order/shopify
  app.use('/api/v1/report', report);
  app.use('/api/v1/dashboard', dashboard);
  app.use('/api/v1/delivery-service-accounts', deliverServiceAccounts);
  app.use('/api/v1/search', search);
  app.use('/api/v1/', admin);

  app.use('/api/v1/logs', log);

  app.get('/*', (req, res) => {
    res.sendFile(path.join(rootDir, '../client', 'build', 'index.html'));
  });
};
