import * as express from 'express';
import { login, signup } from '../controllers/authController';
import { body } from 'express-validator/check';
import * as passportConfig from '../../config/passport';

const authRouter = express.Router();

authRouter.post('/signup',[
  body('email')
   .not().isEmpty()
   .isEmail()
   .normalizeEmail(),
  body('name')
   .not().isEmpty(),
  body('password')
   .not().isEmpty()
   .matches(/.{4,}/)
], signup);

authRouter.post('/login',[
  body('email')
   .not().isEmpty(),
  body('password')
   .not().isEmpty()
] ,passportConfig.requireLogin, login);

export { authRouter };
