import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";

export const createPassword = async (data) => {
  const salt = 10;
  return await bcrypt.hash(data, salt);
};

export const checkPassword = async (userPassword, input) => {
  return await bcrypt.compare(input, userPassword);
};

export const generateToken = async ({ userID, userName }) => {
  const token = await sign({ userID, userName }, process.env.SECRET_KEY, {
    expiresIn: "1y",
  });
  return token;
};
