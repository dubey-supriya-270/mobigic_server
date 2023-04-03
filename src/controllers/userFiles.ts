import { validateHashedString } from "../helpers/bcryptFunction";
import { Result } from "../interfaces/result";
import { IUserFiles, IUserCreateFiles } from "../interfaces/userFiles";
import { deleteFileToBlob } from "../middlewares/uploadFile";
import * as userFilesRepositories from "../repositories/userFiles";

//  Function  to store user file
const createUserFile = async (data: IUserCreateFiles) => {
  try {
    // calling the store user file repo function to store data
    const result: Result = await userFilesRepositories.createUserFile(data);
    // If there is any error then throw error
    if (result.isError()) {
      throw result.error;
    }
    // If there is no error then return as false
    return Result.ok(result);
  } catch (error) {
    return Result.error(error);
  }
};

//  Function to display user files using userId
const retrieveUserFilesByUserId = async (
  userId: string
): Promise<Result<IUserFiles[]>> => {
  try {
    const userFileDetails =
      await userFilesRepositories.retrieveUserFilesByUserId(userId);

    // If there is error coming from db
    if (userFileDetails.isError()) {
      throw userFileDetails.error;
    }
    // If there is no error return error as false
    return Result.ok(userFileDetails.data);
  } catch (error) {
    return Result.error(error);
  }
};

//  Function to display user files using userId
const deleteUserFileById = async (id: string) => {
  try {
    const userFileDetails = await userFilesRepositories.retrieveUserFileById(
      id
    );

    // If there is error coming from db
    if (userFileDetails.isError()) {
      throw userFileDetails.error;
    }

    // call a delete function to delete a file from blob store
    const deleteBlobFileResponse = await deleteFileToBlob(
      userFileDetails.data!.fileUrl
    );

    if (!deleteBlobFileResponse) {
      throw deleteBlobFileResponse;
    }
    const deleteFileMessage = await userFilesRepositories.deleteUserFileById(
      id
    );

    if (deleteFileMessage.isError()) {
      throw deleteFileMessage.error;
    }

    // If there is no error return error as false
    return Result.ok(deleteFileMessage.data);
  } catch (error) {
    return Result.error(error);
  }
};

//  Function to verify unique code
const verifyUniqueCode = async (id: string, uniqueCode: string) => {
  try {
    const userFileDetails = await userFilesRepositories.retrieveUserFileById(
      id
    );

    // If there is error coming from db
    if (userFileDetails.isError()) {
      throw userFileDetails.error;
    }

    const verifyUniqueCodeResponse = await validateHashedString(
      uniqueCode,
      userFileDetails.data!.uniqueCode
    );

    if (!verifyUniqueCodeResponse) {
      return Result.error("Unique code not correct");
    }
    // If there is no error return error as false
    return Result.ok(userFileDetails.data?.fileUrl);
  } catch (error) {
    return Result.error(error);
  }
};

export default {
  createUserFile,
  retrieveUserFilesByUserId,
  deleteUserFileById,
  verifyUniqueCode,
};
