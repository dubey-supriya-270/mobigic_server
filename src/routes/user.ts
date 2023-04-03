import express, { Request, Response, NextFunction } from "express";
import jwtToken from "../helpers/getJwt";
import { IUser } from "../interfaces/user";
import * as userController from "../controllers/user";
import STATUS from "../constants/statusCode";
import { CustomError } from "../middlewares/error";
import { hashedString, validateHashedString } from "../helpers/bcryptFunction";
const router = express.Router();

// Route for signup
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // destructuring data.
      const { userName, password } = req.body;

      // creating payload
      const data: IUser = {
        userName,
        password,
      };

      // If any of these parameter are missing then return error
      if (!userName || !password) {
        // Throw an error if any parameter is not provided
        const err: CustomError = {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: `UserName & Password can't be null`,
        };

        throw err;
      }
      let hashedPassword = await hashedString(password);

      // Call the addUserDetails controller function to store user in DB
      const result = await userController.addUserDetails({
        userName: userName,
        password: hashedPassword,
      });
      if (result.isError()) {
        throw result.error;
      }

      const token = jwtToken.generateAccessToken(
        result.data.userName,
        result.data._id
      );

      // return success response
      res.status(STATUS.OK).json({
        status: STATUS.OK,
        message: data,
        userId: result.data._id,
        token,
      });
    } catch (error) {
      console.log("error", error);
      next(error);
    }
  }
);
// Route for user login
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName, password } = req.body;

      // validating required parameters
      if (!userName || !password) {
        // Throw an error if any parameter is not provided
        const err: CustomError = {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: `UserName & Password can't be null`,
        };

        throw err;
      }
      // To check whether user exists or not
      const isUserExist = await userController.fetchUserDetails(userName);

      if (isUserExist.isError()) {
        throw isUserExist.error;
      }

      // To check if entered password is correct
      const validatePassword = await validateHashedString(
        password,
        isUserExist.data.password
      );

      if (!validatePassword) {
        // throw an error if entered password is invalid

        const err: CustomError = {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: "Invalid Credentials",
        };
        throw err;
      }
      // return success response when userName & password is correct
      const token = jwtToken.generateAccessToken(
        isUserExist.data.userName!,
        isUserExist.data._id.toString()
      );
      res.status(STATUS.OK).json({
        status: STATUS.OK,
        token,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
