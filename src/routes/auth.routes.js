import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const authController = new AuthController();
const authRoutes = Router();

authRoutes.route('/register').post(authController.register);
authRoutes.route('/login').post(authController.login);

export default authRoutes;
