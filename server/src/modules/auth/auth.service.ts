import bcrypt from "bcryptjs";
import prisma from "../../config/prisma";
import jwt from "jsonwebtoken";

import { env } from "../../config/env";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt";

import { LoginBody, SignupBody } from "./auth.types";

export const signupService = async (data: SignupBody) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const loginService = async (data: LoginBody) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessTokenService = async (
  refreshToken: string
) => {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  const decoded = jwt.verify(
    refreshToken,
    env.JWT_REFRESH_SECRET
  ) as { userId: string };

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = generateAccessToken(user.id);

  return {
    accessToken,
  };
};

export const logoutService = async (userId: string) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: null,
    },
  });
};