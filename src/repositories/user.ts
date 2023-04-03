import STATUS from "../constants/statusCode";
import { Users } from "../db-init/models/users";
import { Result } from "../interfaces/result";
import { IUser } from "../interfaces/user";

// function for storing user details.
export const addUserDetails = async (data: IUser): Promise<Result> => {
  try {
    // creating new user details data in database.
    const result = await Users.create({
      userName: data.userName,
      password: data.password,
      createdAt: new Date().toISOString(),
    });

    // if user details stored than return success as true
    return Result.ok(result);
  } catch (error) {
    return Result.error({
      statusCode: STATUS.BAD_REQUEST,
      customMessage: `Unable to add user`,
    });
  }
};

// Function to fetch user details by userName
export const fetchUserDetailsByUserName = async (
  userName: string
): Promise<Result> => {
  try {
    // Using findOne Function to fetch the account.
    const result = await Users.findOne({
      userName,
    }).exec();

    return Result.ok(result);
  } catch (error) {
    // returning success as false
    return Result.error({
      statusCode: STATUS.BAD_REQUEST,
      customMessage: `Unable to fetch user details by userName`,
    });
  }
};
