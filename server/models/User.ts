import * as bcrypt from 'bcrypt-nodejs';
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';

import { comparePasswordFunction, IUser } from '../types/models/user';

/**
 * user document schema
 */
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    unique: true,
    type: String
  },
  password: String,
  auth: {
    token: String,
    used: Boolean,
    exipredIn: Date
  }
},{ timestamps: true });

/**
 * hash user password
 */
userSchema.pre('save',function (next: mongoose.HookNextFunction) {
  const user = this;
  if(!user.isModified('password')){
    return next();
  }

  bcrypt.genSalt(10, function (err, salt) {
    if(err){
      return next(err);
    }
    bcrypt.hash(user.password, salt,() => null, function (err, hash) {
      if(err){
        return next(err);
      }
      user.password = hash;
      user.auth = {
        token: salt,
        used: true,
        expiredIn: 3600*60*60*24*30
      }
      next();
    });
  });
});

const comparePassword: comparePasswordFunction = function comparePassword(password ,cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * compare user passwords
 */
userSchema.methods.comparePassword = comparePassword;

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size: number = 200) {
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

/**
 * User model
 */
const User = mongoose.model<IUser>('User',userSchema);

export default User;
