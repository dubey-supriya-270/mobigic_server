import { Result } from "../interfaces/result";
import { IUser } from "../interfaces/user";
import * as userRepositories from "../repositories/user";

//  Function  to store user details
export const addUserDetails = async (data: IUser) => {
  try {
    // Checking if email exist
    const isAccountIdExist: Result =
      await userRepositories.fetchUserDetailsByUserName(data.userName);

    // throws as error if user exist
    if (isAccountIdExist?.data) {
      return Result.error("User already exists");
    }
    // calling the store user details repo function to store data
    const result: Result = await userRepositories.addUserDetails(data);
    // If there is any error then throw error
    if (result.isError()) {
      throw result.error;
    }
    // If there is no error then return as false
    return Result.ok(result.data);
  } catch (error) {
    return Result.error(error);
  }
};

//  Function to display user details using user name
export const fetchUserDetails = async (userName: string) => {
  try {
    // To check whether email id already exist in db.
    const accountExist: Result =
      await userRepositories.fetchUserDetailsByUserName(userName);

    // If username doesn't exist throw an error
    if (accountExist.isError()) {
      throw accountExist.error;
    }
    // If there is no error return error as false
    return Result.ok(accountExist.data);
  } catch (error) {
    return Result.error(error);
  }
};
