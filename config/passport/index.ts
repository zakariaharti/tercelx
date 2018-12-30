import { Strategy as LocalStrategy} from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import * as passport from 'passport';

import { default as User } from '../../server/models/User';
import { IUser } from '../../server/types/models/user';

passport.serializeUser((user: IUser, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: Error, user: IUser) => {
    done(err, user);
  });
});

/**
 * sign in using email & password
 */
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).exec();
      if(!user){
        return done(null, false), {message: `${email} not found`};
      }
      user.comparePassword(password, function (err, isMatch){
        if(err){
          return done(err);
        }
        if(isMatch){
          return done(null, user);
        }
        return done(null, false, {message: `Either the email or the password is incorrect`});
      });
    } catch(error){
      return done(error);
    }
  })
);

/**
 * sign in using Json web token
 */
passport.use(
  new JwtStrategy({
    secretOrKey: process.env.JWT_SECRET || 'secret',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, async (payload, done) => {
    try {
      const user = User.findById(payload.sub).exec();
      if(!user){
        return done(null, false);
      }
      return done(null, user);
    } catch(error) {
      return done(error);
    }
  })
);

export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireLogin = passport.authenticate('local',{ session: false });
