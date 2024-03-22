import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP,
  HASH_SALT_ROUNDS,
} from '../constants/app.constants';

export const generateAccessToken = (payload) => jwt.sign(payload, ACCESS_TOKEN_SECRET, {
  expiresIn: ACCESS_TOKEN_EXP,
});

export const generateRefreshToken = (email) => jwt.sign({ email }, REFRESH_TOKEN_SECRET, {
  expiresIn: REFRESH_TOKEN_EXP,
});

export const hashPassword = async (password) => bcryptjs.hash(password, HASH_SALT_ROUNDS);

export const comparePassword = async (password, passwordHash) => bcryptjs.compare(
  password,
  passwordHash,
);
