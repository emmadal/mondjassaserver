import { UserModel, PostModel, CategoryModel } from "../models";

export const resolvers = {
  Query: () => {
    users: async () => await UserModel.find();
  },
};
