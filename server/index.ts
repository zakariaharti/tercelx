/* modules dependencies */
import * as express from 'express';
import * as morgan from 'morgan';
import * as cors  from "cors";
import * as helmet from 'helmet';
import * as lusca from 'lusca';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
// import * as multer from 'multer';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
 //import * as path from 'path';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import * as chalk from 'chalk';
import * as errorHandler from 'errorhandler';
// mongodb store for sessions
const MongoStore = require('connect-mongo')(session);

/** init multer */
// const uploads = multer({ dest: path.resolve(path.dirname(__dirname),'build','public','uploads')});

/**
 * loading environment variables where api keys and other options is configured
 */
 dotenv.config();

 /**
  * create express server instance
  */
const app = express();

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
app.use(passport.session());
app.use(lusca.csrf());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(helmet());
app.use(cors());
app.use(cookieParser());

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
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
