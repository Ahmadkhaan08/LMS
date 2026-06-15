import { Response } from "express";
import { redis } from "../utilis/redis";
import userModel from "../models/user.model";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJSON = await redis.get(id);

  if (userJSON) {
    const user = JSON.parse(userJSON);

    res.status(200).json({
      success: true,
      user,
    });
  }
};

// Get all users
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    users,
  });
};

// update user role service
export const updateUserRoleService = async (
  res: Response,
  email: string,
  role: string,
) => {
  const user = await userModel.findOneAndUpdate(
    { email },
    { role },
    { new: true },
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found with this email",
    });
  }
  res.status(201).json({
    success: true,
    user,
  });
};
