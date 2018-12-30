import * as express from 'express';
import { login, signup } from '../controllers/authController';
import * as passportConfig from '../../config/passport';

const app = express.Router();

app.post('/signup', signup);
app.post('/login', passportConfig.requireLogin, login);
