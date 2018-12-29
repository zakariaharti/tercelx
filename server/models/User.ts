import * as bcrypt from 'bcrypt-nodejs';
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';

/**
 * user document schema
 */
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    unique: true,
    type: String
  },
  password: String
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
      next();
    });
  });
});

/**
 * compare user passwords
 */
userSchema.methods.comparePassword = function comparePassword(
  password: string,
  cb: (err: Error, isMatch: boolean) => void
) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

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
const User = mongoose.model('User',userSchema);

export default User;
