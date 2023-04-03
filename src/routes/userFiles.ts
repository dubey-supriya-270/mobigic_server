import express, { NextFunction, Request, Response } from "express";
import STATUS from "../constants/statusCode";
import controller from "../controllers/userFiles";
import { Result } from "../interfaces/result";
import { CustomError } from "../middlewares/error";
import { uploadFileToBlob } from "../middlewares/uploadFile";
import { hashedString } from "../helpers/bcryptFunction";
import auth from "../middlewares/auth";
const router = express.Router();
const multer = require("multer");

// upload contains the path where multer will temporarily store files
const upload = multer({ dest: "uploads/" });

/**
 * @route for adding user files
 * @description
 * - @accept userId, fileUrl
 * - @returns success response if user files is saved
 * @params
 * - @requires userId: id of the user
 * - @requires fileUrl: fileUrl of files to be added
 */
router.post(
  "/",
  upload.single("file"),
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = (req as any).file;

      const fileUrl = await uploadFileToBlob(file);
      const { userId } = req.user;

      // Verify files details
      if (!userId || !fileUrl) {
        // Throw an error if any parameter is not provided
        const err: CustomError = {
          statusCode: STATUS.BAD_REQUEST,
          customMessage: `All parameters for user files are required`,
        };

        throw err;
      }

      const uniqueSixDigitString: number =
        Math.floor(Math.random() * 900000) + 100000;

      const hashedUniqueSixDigitString = await hashedString(
        uniqueSixDigitString.toString()
      );

      // If request body verified then add user files
      const result: Result = await controller.createUserFile({
        userId,
        fileUrl,
        uniqueCode: hashedUniqueSixDigitString,
        fileName: file.originalname,
      });

      // If there is any error throw the error
      if (result.isError()) {
        throw result.error;
      }

      res.status(200).json({
        status: STATUS.OK,
        message: `Saved user files successfully`,
        uniqueCode: uniqueSixDigitString.toString(),
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route to get user files for a userId
 * @description
 * - @accept bearer token
 * - @returns List of user file
 * @params
 * - @requires token: token to access
 */
router.get(
  "/",
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //Passing user id from auth
      const { userId } = req.user;

      const result: Result = await controller.retrieveUserFilesByUserId(userId);

      if (result.isError()) {
        throw result.error;
      }

      res.status(200).json({
        status: 200,
        data: result.data,
        message: `Retrieved user files successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route to delete a files
 * @description
 * - @accept id
 * - @returns success response if user file is successfully deleted
 * @params
 * - @requires id: Id of the user file
 */
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //Passing user file id as params
      const { id } = req.params;

      const result: Result = await controller.deleteUserFileById(id);

      // If there is any error throw the error
      if (result.isError()) {
        throw result.error;
      }

      res.status(200).json({
        status: 200,
        message: `Deleted user file successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route to verify unique code a files
 * @description
 * - @accept id
 * - @accept uniqueCode
 * - @returns success response if unique code is successfully verified
 * @params
 * - @requires id: Id of the user file
 * - @requires uniqueCode: Unique code of the user file:
 */
router.post(
  "/verify-unique-code",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //Passing user file id ,uniqueCode as body
      const { id, uniqueCode } = req.body;

      const result: Result = await controller.verifyUniqueCode(id, uniqueCode);

      // If there is any error throw the error
      if (result.isError()) {
        throw result.error;
      }

      res.status(200).json({
        status: 200,
        message: `Verify unique code successfully`,
        fileUrl: result.data,
      });
    } catch (error) {
      next(error);
    }
  }
);
export default router;
