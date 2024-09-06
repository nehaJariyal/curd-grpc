import { Op } from "sequelize";
import database from "../models/index";

export const createUser = async (data: any) => {
  try {
    const user = database.userModel.create({
      id: data.id,
      username: data.username,
      password: data.password,
 
    });
    return user;
  } catch (error: any) {
    console.error("Error creating user:", error);
    return false;
  }
};
 