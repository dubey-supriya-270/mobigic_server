import STATUS from "../../constants/statusCode";
import { Users } from "../../db-init/models/users";
import {
  addUserDetails,
  fetchUserDetailsByUserName,
} from "../../repositories/user";

const MockedUser = Users as jest.Mocked<any>;

describe("Testing users repositories ", () => {
  it("should return error when  add user", async () => {
    // given
    MockedUser.create = () => {
      throw new Error();
    };
    const payload = {
      userName: "test",
      password: "test@123",
    };

    // when
    const result: any = await addUserDetails(payload);

    // then
    expect(result.error).toBeTruthy();
    expect(result.error?.statusCode).toBe(STATUS.BAD_REQUEST);
    expect(result.error?.customMessage).toBe(`Unable to add user`);
  });

  it("should add user", async () => {
    // given
    const payload = {
      userName: "test",
      password: "test@123",
    };

    MockedUser.create = () => {};

    // when
    const result: any = await addUserDetails(payload);

    // then
    expect(result.isOk()).toBeTruthy();
  });

  it("should fetch user by user name", async () => {
    // given
    MockedUser.findOne = () => ({
      ...Users.find,
      exec: () => [],
    });

    // when
    const result: any = await fetchUserDetailsByUserName("test");

    // then
    expect(result.data).toEqual([]);
  });

  it("should return error when user by username", async () => {
    // given
    MockedUser.findOne = () => {
      throw new Error();
    };

    // when
    const result: any = await fetchUserDetailsByUserName("test");

    // then
    expect(result.data).toEqual(null);
    expect(result.error.customMessage).toBe(
      "Unable to fetch user details by userName"
    );
  });
});
