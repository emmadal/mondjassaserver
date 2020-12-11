import bcrypt from "bcrypt";

export const createPassword = async (data) => {
  const salt = 10;
  return await bcrypt.hash(data, salt);
};

export const checkPassword = async (userPassword, input) => {
  return await bcrypt.compare(input, userPassword);
};
