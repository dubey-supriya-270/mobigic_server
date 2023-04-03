// Importing  jwt
import jwt from "jsonwebtoken";

// function to generate token
const generateAccessToken = (userName: string, _id: string) => {
  return jwt.sign(
    {
      userName,
      userId: _id,
    },
    "process.env.TOKEN_SECRET",
    {
      expiresIn: "20h",
    }
  );
};

export default {
  generateAccessToken,
};
