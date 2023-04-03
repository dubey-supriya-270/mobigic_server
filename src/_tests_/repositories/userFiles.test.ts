import STATUS from "../../constants/statusCode";
import { UserFiles } from "../../db-init/models/userFiles";
import {
  createUserFile,
  deleteUserFileById,
  retrieveUserFileById,
  retrieveUserFilesByUserId,
} from "../../repositories/userFiles";

const MockedUser = UserFiles as jest.Mocked<any>;

describe("Testing userFiles repositories ", () => {
  it("should return error when  create user file", async () => {
    // given
    MockedUser.create = () => {
      throw new Error();
    };
    const payload = {
      fileUrl: "www.example.com",
      userId: "12344Test",
      uniqueCode: "hashedCode",
      fileName: "example.pdf",
    };

    // when
    const result: any = await createUserFile(payload);

    // then
    expect(result.error).toBeTruthy();
    expect(result.error?.statusCode).toBe(STATUS.BAD_REQUEST);
    expect(result.error?.customMessage).toBe(`Unable to create user file`);
  });

  it("should create user", async () => {
    // given
    const payload = {
      fileUrl: "www.example.com",
      userId: "12344Test",
      uniqueCode: "hashedCode",
      fileName: "example.pdf",
    };

    MockedUser.create = () => {};

    // when
    const result: any = await createUserFile(payload);

    // then
    expect(result.isOk()).toBeTruthy();
    expect(result.data.message).toBe("User file created successfully");
  });

  it("should retrieve user file by user id", async () => {
    // given
    MockedUser.find = () => ({
      ...UserFiles.find,
      exec: () => [],
    });

    // when
    const result: any = await retrieveUserFilesByUserId("test");

    // then
    expect(result.data).toEqual([]);
  });

  it("should return error when user file by user id", async () => {
    // given
    MockedUser.find = () => {
      throw new Error();
    };

    // when
    const result: any = await retrieveUserFilesByUserId("test");

    // then
    expect(result.data).toEqual(null);
    expect(result.error.customMessage).toBe(
      "Unable to retrieve user files by userId"
    );
  });

  it("should retrieve user file by id", async () => {
    // given
    MockedUser.findOne = () => ({
      ...UserFiles.findOne,
      exec: () => [],
    });

    // when
    const result: any = await retrieveUserFileById("test");

    // then
    expect(result.data).toEqual([]);
  });

  it("should return error when user file by id", async () => {
    // given
    MockedUser.findOne = () => {
      throw new Error();
    };

    // when
    const result: any = await retrieveUserFileById("test");

    // then
    expect(result.data).toEqual(null);
    expect(result.error.customMessage).toBe(
      "Unable to retrieve user files by id"
    );
  });

  it("should return error when delete user file with id as $id", async () => {
    // given
    MockedUser.deleteOne = () => {
      throw new Error();
    };

    // when
    const result: any = await deleteUserFileById("userFileId");

    // then
    expect(result.isError()).toBeTruthy();
    expect(result.error?.customMessage).toBe(
      "Unable to retrieve user files by id"
    );
  });

  it("should delete user file", async () => {
    // given
    MockedUser.deleteOne = () => ({
      ...UserFiles.deleteOne,
      exec: () => [],
    });

    // when
    const result: any = await deleteUserFileById("userFileId");

    // then
    expect(result.isOk()).toBeTruthy();
    expect(result.data).toBe("File deleted successfully");
  });
});
