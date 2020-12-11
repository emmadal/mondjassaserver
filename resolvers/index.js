import { ApolloError } from "apollo-server";
import { UserModel, PostModel, CategoryModel } from "../models";
import { createPassword, checkPassword } from "../utils";

export const resolvers = {
  Query: {
    users: async () => await UserModel.find(),
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const user = await UserModel.findOne({ email: input.email });
      if (user) return new ApolloError("User already exist!");
      input.password = await createPassword(input.password);
      return await UserModel.create(input);
    },
  },
};
