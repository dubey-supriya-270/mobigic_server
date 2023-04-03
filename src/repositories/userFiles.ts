import STATUS from "../constants/statusCode";
import { UserFiles } from "../db-init/models/userFiles";

import { Result } from "../interfaces/result";
import { IUserFiles, IUserCreateFiles } from "../interfaces/userFiles";

// function for storing user file.
export const createUserFile = async (
  data: IUserCreateFiles
): Promise<Result> => {
  try {
    // creating new user file data in database.
    await UserFiles.create({
      fileUrl: data.fileUrl,
      userId: data.userId,
      uniqueCode: data.uniqueCode,
      fileName: data.fileName,
      uploadAt: new Date(),
    });

    // if user file stored than return success as true
    return Result.ok({ message: "User file created successfully" });
  } catch (error) {
    return Result.error({
      statusCode: STATUS.BAD_REQUEST,
      customMessage: `Unable to create user file`,
    });
  }
};

// Function to retrieve user files by userId
export const retrieveUserFilesByUserId = async (
  userId: string
): Promise<Result<IUserFiles[]>> => {
  try {
    // Using find Function to fetch the account.
    const result = await UserFiles.find(
      {
        userId,
      },
      { _id: 1, fileName: 1, uploadAt: 1 }
    ).exec();

    return Result.ok(result);
  } catch (error) {
    // returning success as false
    return Result.error({
      statusCode: STATUS.BAD_REQUEST,
      customMessage: `Unable to retrieve user files by userId`,
    });
  }
};

// Function to retrieve user file by Id
export const retrieveUserFileById = async (
  id: string
): Promise<Result<IUserFiles>> => {
  try {
    // Using find Function to fetch the account.
    const result = await UserFiles.findOne(
      {
        _id: id,
      },
      { fileUrl: 1, uniqueCode: 1 }
    ).exec();

    return Result.ok(result!);
  } catch (error) {
    // returning success as false
    return Result.error({
      statusCode: STATUS.BAD_REQUEST,
      customMessage: `Unable to retrieve user files by id`,
    });
  }
};

export const deleteUserFileById = async (id: string): Promise<Result> => {
  try {
    // delete files from db.
    await UserFiles.deleteOne({
      _id: id,
    }).exec();

    return Result.ok("File deleted successfully");
  } catch (error) {
    // returning success as false
    return Result.error({
      statusCode: STATUS.BAD_REQUEST,
      customMessage: `Unable to retrieve user files by id`,
    });
  }
};
