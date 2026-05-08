import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export const generateAccessToken = (userId: string) => {
  const payload = { userId };

  const secret: Secret = env.JWT_ACCESS_SECRET;

  const options: SignOptions = {
    expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const generateRefreshToken = (userId: string) => {
  const payload = { userId };

  const secret: Secret = env.JWT_REFRESH_SECRET;

  const options: SignOptions = {
    expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};