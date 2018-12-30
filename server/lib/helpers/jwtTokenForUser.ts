import * as jwt from 'jsonwebtoken';

import { IUser } from "../../types/models/user";

export const generateTokenForUser = (user: IUser) => {
  return jwt.sign(
    {
      sub: user.id,
    },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn: 60*60*24*30
    }
  );
};
