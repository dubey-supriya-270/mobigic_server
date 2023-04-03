import STATUS from "../../constants/statusCode";
import { Result } from "../../interfaces/result";
import * as repositories from "../../repositories/userFiles";
import controller from "../../controllers/userFiles";
import * as uploadFile from "../../middlewares/uploadFile";
import * as bcryptFunction from "../../helpers/bcryptFunction";

describe("Testing user files controller", () => {
  const userName = "test";

  const payload = {
    fileUrl: "www.example.com",
    userId: "12344Test",
    uniqueCode: "hashedCode",
    fileName: "example.pdf",
  };

  it("should return error when createUserFile", async () => {
    jest
      .spyOn(repositories, "createUserFile")
      .mockResolvedValue(Result.error());

    const result: any = await controller.createUserFile(payload);

    expect(result.isError).toBeTruthy();

    expect(repositories.createUserFile).toHaveBeenCalledWith(payload);
  });

  it("should create user file", async () => {
    jest.spyOn(repositories, "createUserFile").mockResolvedValue(Result.ok());

    const result: any = await controller.createUserFile(payload);

    expect(result.isOk).toBeTruthy();

    expect(repositories.createUserFile).toHaveBeenCalledWith(payload);
  });

  it("should return error when retrieve user files by user id  using invalid user id", async () => {
    jest.spyOn(repositories, "retrieveUserFilesByUserId").mockResolvedValue(
      Result.error({
        statusCode: STATUS.NOT_FOUND,
        customMessage: `Unable to retrieve user files by userId`,
      })
    );

    const result: any = await controller.retrieveUserFilesByUserId(
      payload.userId
    );

    expect(result.isError).toBeTruthy();

    expect(result.error.statusCode).toBe(STATUS.NOT_FOUND);

    expect(result.error.customMessage).toBe(
      `Unable to retrieve user files by userId`
    );

    expect(repositories.retrieveUserFilesByUserId).toHaveBeenCalledWith(
      payload.userId
    );
  });

  it("should retrieve user files by user id", async () => {
    jest
      .spyOn(repositories, "retrieveUserFilesByUserId")
      .mockResolvedValue(Result.ok([]));

    const result: any = await controller.retrieveUserFilesByUserId(
      payload.userId
    );

    expect(result.isOk).toBeTruthy();

    expect(result.data).toEqual([]);

    expect(repositories.retrieveUserFilesByUserId).toHaveBeenCalledWith(
      payload.userId
    );
  });

  it("should delete user files by id", async () => {
    jest
      .spyOn(repositories, "retrieveUserFileById")
      .mockResolvedValue(Result.ok());

    jest.spyOn(uploadFile, "deleteFileToBlob").mockResolvedValue("");

    jest
      .spyOn(repositories, "deleteUserFileById")
      .mockResolvedValue(Result.ok());

    const result: any = await controller.deleteUserFileById("test");

    expect(result.isOk).toBeTruthy();

    expect(repositories.retrieveUserFileById).toHaveBeenCalledWith("test");
  });

  it("should return error when delete user files by id with file not exist", async () => {
    jest
      .spyOn(repositories, "retrieveUserFileById")
      .mockResolvedValue(Result.error());

    const result: any = await controller.deleteUserFileById("test");

    expect(result.isError).toBeTruthy();

    expect(repositories.retrieveUserFileById).toHaveBeenCalledWith("test");
  });

  it("should return error when delete user files by id with deleteUserFileById failed", async () => {
    jest
      .spyOn(repositories, "retrieveUserFileById")
      .mockResolvedValue(Result.ok());

    jest.spyOn(uploadFile, "deleteFileToBlob").mockResolvedValue("");

    jest
      .spyOn(repositories, "deleteUserFileById")
      .mockResolvedValue(Result.error());

    const result: any = await controller.deleteUserFileById("test");

    expect(result.isError).toBeTruthy();

    expect(repositories.retrieveUserFileById).toHaveBeenCalledWith("test");
  });

  it("should return error when verify unique code", async () => {
    jest
      .spyOn(repositories, "retrieveUserFileById")
      .mockResolvedValue(Result.error());

    const result: any = await controller.verifyUniqueCode("test", "12345");

    expect(result.isError).toBeTruthy();

    expect(repositories.retrieveUserFileById).toHaveBeenCalledWith("test");
  });

  it("should verify unique code", async () => {
    jest
      .spyOn(repositories, "retrieveUserFileById")
      .mockResolvedValue(Result.ok());

    jest.spyOn(bcryptFunction, "validateHashedString").mockResolvedValue(true);

    const result: any = await controller.verifyUniqueCode("test", "12345");

    expect(result.isOk).toBeTruthy();

    expect(repositories.retrieveUserFileById).toHaveBeenCalledWith("test");
  });
});
