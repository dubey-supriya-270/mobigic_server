import supertest from "supertest";
import { Users } from "../../db-init/models/users";
import app from "../../index";
import STATUS from "../../constants/statusCode";

const MockedUser = Users as jest.Mocked<any>;

describe("Testing users routes ", () => {
  afterEach(() => {
    // clearing the mock
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  const payload = {
    userName: "test",
    password: "test@123",
  };

  it("POST /user/register should return success response and add user ", async () => {
    // given
    MockedUser.create = () => [{ userName: "test", _id: "test" }];

    MockedUser.findOne = () => {
      throw new Error();
    };

    // when
    const result = await supertest(app)
      .post("/user/register")
      .set("Content-type", "application/json")
      .send(payload);

    // then

    expect(result.statusCode).toBe(STATUS.OK);
  });

  it("POST /user/register should return error response and add user ", async () => {
    // given
    MockedUser.create = () => [{ userName: "test", _id: "test" }];

    MockedUser.findOne = () => ({
      ...Users.find,
      exec: () => [],
    });

    // when
    const result: any = await supertest(app)
      .post("/user/register")
      .set("Content-type", "application/json")
      .send(payload);

    // then

    expect(result.data).toBe("User already exists");
  });
});
