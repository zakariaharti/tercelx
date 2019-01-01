/* modules dependencies */
import * as express from 'express';
import * as morgan from 'morgan';
import * as cors  from "cors";
import * as helmet from 'helmet';
import * as lusca from 'lusca';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import * as chalk from 'chalk';
import * as errorHandler from 'errorhandler';
//import * as authRouter from './routes/authRouter';

import { login, signup } from './controllers/authController';
import { body } from 'express-validator/check';
import * as passportConfig from './../config/passport';
// import * as multer from 'multer';
//import * as path from 'path';
// mongodb store for sessions
const MongoStore = require('connect-mongo')(session);

/** init multer */
// const uploads = multer({ dest: path.resolve(path.dirname(__dirname),'build','public','uploads')});

/**
 * loading environment variables where api keys and other options is configured
 */
 dotenv.load();

 /**
  * create express server instance
  */
const app = express();

// Set Development modes checks
const isDevMode = process.env.NODE_ENV === 'development' || false;
const isProdMode = process.env.NODE_ENV === 'production' || false;

// Run Webpack dev server in development mode
if (isDevMode) {
  // Webpack Requirements
  // eslint-disable-next-line global-require
  const webpack = require('webpack');
  // eslint-disable-next-line global-require
  const config = require('../webpack.client.dev');
  // eslint-disable-next-line global-require
  const webpackDevMiddleware = require('webpack-dev-middleware');
  // eslint-disable-next-line global-require
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    watchOptions: {
      poll: 1000,
    },
  }));
  app.use(webpackHotMiddleware(compiler));
}


/**
 * connect to MongoDB
 */
 mongoose.set('useFindAndModify', false);
 mongoose.set('useCreateIndex', true);
 mongoose.set('useNewUrlParser', true);
 (async () => {
   try {
     await mongoose.connect(process.env.MONGODB_URI || '');
   } catch(err){
     console.error(err);
     // @ts-ignore
     console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
     process.exit();
   }
 });

 /**
  * express configuration
  */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || 'secret',
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));
app.use(passport.initialize());
app.use(lusca.csrf());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(helmet());
app.use(cors());
app.use(cookieParser());

/**
 * authentication routes
 */

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

// @ts-ignore
 app.get('/',(req,res) => res.end('hello world'));

/**
 * Error Handler.
 */
if (!isProdMode) {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((
    err: express.Errback,
    // @ts-ignore
    req: express.Request,
    res: express.Response,
    // @ts-ignore
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  // @ts-ignore
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
