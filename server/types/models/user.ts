import { Document } from 'mongoose';

export type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;

export interface IUser extends Document{
  id: string;
  name: string;
  email: string;
  password: string;
  auth: {
    token: string;
    exipredIn: number;
    used: boolean;
  },
  comparePassword: comparePasswordFunction,
  gravatar: (size: number) => string
}
