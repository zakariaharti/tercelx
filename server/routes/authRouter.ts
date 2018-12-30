import * as express from 'express';
import { login, signup } from '../controllers/authController';
import { body } from 'express-validator/check';
import * as passportConfig from '../../config/passport';

const app = express.Router();

app.post('/signup',[
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
app.post('/login',[
  body('email')
   .not().isEmpty(),
  body('password')
   .not().isEmpty()
] ,passportConfig.requireLogin, login);

export default app;
