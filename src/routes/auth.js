import express from 'express';
import AuthController from '../controllers/AuthController';
import schemaValidator from '../middleware/schemaValidator';
import Auth from '../middleware/auth';
import { loginSchema, updatedPasswordSchema } from '../schemas/authSchema';

const router = express.Router();

router.post('/login', schemaValidator(loginSchema), AuthController.login);
router.get('/profile', Auth, AuthController.profile);
router.post(
  '/update-password',
  Auth,
  schemaValidator(updatedPasswordSchema),
  AuthController.updatePassword
);
export default router;
