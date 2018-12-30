import { RequestHandler } from 'express';
import { default as User } from '../models/User';
import { generateTokenForUser } from '../lib/helpers/jwtTokenForUser';
import { validationResult } from 'express-validator/check';

/**
 * POST /login
 */
export const login: RequestHandler = (req, res) => {
  const { name, email } = req.user;

  res.json({
    token: generateTokenForUser(req.user),
    name,
    email
  });
};

/**
 * POST /signup
 */
export const signup: RequestHandler = async (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(422).json({ errors: errors.array() });
  }

  const user = new User({
    name,
    email,
    password
  });

  try {
    const isUserExist = await User.findOne({ email }).exec();
    if(isUserExist){
      res.status(422).json({ errors: 'the provided email is already exists' });
    }
    await user.save();
    res.json({ name, email });
  } catch(err){
    return next(err);
  }
};
