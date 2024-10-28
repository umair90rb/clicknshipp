import express from 'express';
import path from 'path';
import auth from './auth';
import admin from './admin';
import user from './user';
import item from './item';
import stock from './stock';
import supplier from './supplier';
import category from './category';
import brand from './brand';
import department from './department';
import designation from './designation';
import employee from './employee';
import allowance from './allowance';
import chanel from './chanel';
import customer from './customer';
import role from './role';
import city from './city';
import order from './order';
import report from './report';
import dashboard from './dashboard';
import deliverServiceAccounts from './deliverServiceAccounts';
import permission from './permission';
import search from './search';
import log from './log';
import location from './location';
import uom from './unitOfMeasure';
import rawMaterial from './rawMaterial';

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
  app.use('/api/v1/permission', permission);
  app.use('/api/v1/order', order);
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
