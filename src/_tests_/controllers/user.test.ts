import STATUS from "../../constants/statusCode";
import { Result } from "../../interfaces/result";
import * as repositories from "../../repositories/user";
import * as controller from "../../controllers/user";

describe("Testing user controller", () => {
  const userName = "test";
  const payload = {
    userName: userName,
    password: "test@123",
  };
  it("should return error when fetch user details by username  using invalid user name", async () => {
    jest.spyOn(repositories, "fetchUserDetailsByUserName").mockResolvedValue(
      Result.error({
        statusCode: STATUS.NOT_FOUND,
        customMessage: `Unable to fetch user details by userName`,
      })
    );

    const result: any = await controller.fetchUserDetails(userName);

    expect(result.isError).toBeTruthy();

    expect(result.error.statusCode).toBe(STATUS.NOT_FOUND);

    expect(result.error.customMessage).toBe(
      `Unable to fetch user details by userName`
    );

    expect(repositories.fetchUserDetailsByUserName).toHaveBeenCalledWith(
      userName
    );
  });

  it("should fetch user details by username", async () => {
    jest
      .spyOn(repositories, "fetchUserDetailsByUserName")
      .mockResolvedValue(Result.ok([]));

    const result: any = await controller.fetchUserDetails(userName);

    expect(result.isOk).toBeTruthy();

    expect(result.data).toEqual([]);

    expect(repositories.fetchUserDetailsByUserName).toHaveBeenCalledWith(
      userName
    );
  });

  it("should return error when addUserDetails", async () => {
    jest
      .spyOn(repositories, "fetchUserDetailsByUserName")
      .mockResolvedValue(Result.ok([]));

    const result: any = await controller.addUserDetails(payload);

    expect(result.isError).toBeTruthy();

    expect(result.error.customMessage).toEqual("User already exists");

    expect(repositories.fetchUserDetailsByUserName).toHaveBeenCalledWith(
      userName
    );
  });

  it("should return error when fetchUserDetailsByUserName failed and addUserDetails", async () => {
    jest.spyOn(repositories, "fetchUserDetailsByUserName").mockResolvedValue(
      Result.error({
        statusCode: STATUS.NOT_FOUND,
        customMessage: `Unable to fetch user details by userName`,
      })
    );

    jest.spyOn(repositories, "addUserDetails").mockResolvedValue(
      Result.error({
        statusCode: STATUS.BAD_REQUEST,
        customMessage: `Unable to add user`,
      })
    );

    const result: any = await controller.addUserDetails(payload);

    expect(result.isError).toBeTruthy();

    expect(result.error.customMessage).toEqual("Unable to add user");

    expect(repositories.fetchUserDetailsByUserName).toHaveBeenCalledWith(
      userName
    );

    expect(repositories.addUserDetails).toHaveBeenCalledWith(payload);
  });

  it("should add user ", async () => {
    jest.spyOn(repositories, "fetchUserDetailsByUserName").mockResolvedValue(
      Result.error({
        statusCode: STATUS.NOT_FOUND,
        customMessage: `Unable to fetch user details by userName`,
      })
    );

    jest.spyOn(repositories, "addUserDetails").mockResolvedValue(Result.ok());

    const result: any = await controller.addUserDetails(payload);

    expect(result.isOk).toBeTruthy();

    expect(repositories.fetchUserDetailsByUserName).toHaveBeenCalledWith(
      userName
    );

    expect(repositories.addUserDetails).toHaveBeenCalledWith(payload);
  });
});
