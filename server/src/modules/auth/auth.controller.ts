import { Request, Response } from "express";
import {
  loginService,
  signupService,
} from "./auth.service";
import { refreshAccessTokenService } from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { logoutService } from "./auth.service";

export const signupController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await signupService(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await loginService(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response
) => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshAccessTokenService(
      refreshToken
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    await logoutService(req.userId!);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};