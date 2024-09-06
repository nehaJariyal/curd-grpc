import { Request, Response, NextFunction } from "express";
// import generateJwtToken from "../helper/jwtToken.helper";
import database from "../models/index";

import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.TOKEN_KEY;

const authenticateToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (SECRET_KEY) {
      jwt.verify(token, SECRET_KEY, async (err: any, user: any) => {
        if (err) {
          return res
            .status(401)
            .json({ code: 401, message: "Access denied, No token provide" });
        }
        req.user = user;
        const userEmailFromToken = user.email;

        const userEmaildb: any = await database.userModel.findOne({
          where: { email: userEmailFromToken },
        });
        const userId = userEmaildb.id;
        console.log(":::::::::::::::::::::::user id", userId);

        if (userEmaildb) {
          req.body.userdata = { email: userEmailFromToken, userId };
          next();
        } else {
          return res.status(403).json({
            code: 403,
            message: "Email in token does not match request parameter",
          });
        }
      });
    }
  } else {
    res.status(403).json({ code: 403, message: "Authorization token expired" });
  }
};

export default authenticateToken;
