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
import { authRouter } from './routes/authRouter';

// React and Redux support
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { configureStore } from '../client/store';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { StyleSheetManager, ServerStyleSheet } from 'styled-components';

// import required data
import App from '../client/App';
import routes from '../client/routes';
import { renderer } from './lib/renderer';
import { fetchComponentDataBeforeRender } from './lib/helpers/fetchComponentsDataBeforeRender';

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
  const webpack = require('webpack');
  const config = require('../webpack/webpack.client.dev');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath,
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
app.use('/', authRouter);

/**
 * server side rendering of React & Redux
 */
app.use(async (req, res, next) => {
  // store intance
  const store = configureStore();

  // styled-components ssr support
  const sheet = new ServerStyleSheet();

  // context object
  let context: any = {};

  try{
    const data = await fetchComponentDataBeforeRender(routes, req.path);
    if(data){
      data.forEach(result => {
        if(result){
          Object.assign(context.data, result);
        }
      });
    }
    // render React components html markup
    const initialView = renderToString(
      <StyleSheetManager sheet={sheet}>
        <Provider store={store}>
          <StaticRouter location={req.path} context={context}>
            <App />
          </StaticRouter>
        </Provider>
      </StyleSheetManager>
    );

    // store state
    const finalState = store.getState();

    // final rendered html
    const html = renderer(initialView, finalState, sheet);

    // if a <Redirect /> is encoutered
    if(context.url){
      res.redirect(context.url);
    }

    // if notFound encoutered
    if(context.notFound){
      res.status(404);
    }

    // else send back the response
    res
     .set('Content-Type','text/html')
     .status(200)
     .end(html);

  } catch(err) {
    return next(err);
  }
});

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
    _req: express.Request,
    res: express.Response,
    // @ts-ignore
    _next: express.NextFunction
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
  console.log('Press CTRL-C to stop\n');
});

module.exports = app;
