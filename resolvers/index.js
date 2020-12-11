import { ApolloError } from "apollo-server";
import { UserModel, PostModel, CategoryModel } from "../models";
import { createPassword, checkPassword } from "../utils";

export const resolvers = {
  Query: {
    users: async () => await UserModel.find().sort({ name: 1 }),
    user: async (_, { name }) => {
      return await UserModel.find({ name: { $regex: name, $options: "i" } });
    },
    posts: async () => await PostModel.find().sort({ updateAt: 1 }),
    post: async (_, { title }) => {
      return await PostModel.find({
        title: { $regex: title, $options: "i" },
      }).sort({ updateAt: 1 });
    },
    categories: async () => await CategoryModel.find().sort({ name: 1 }),
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const user = await UserModel.findOne({ email: input.email });
      if (user) return new ApolloError("User already exist!");
      input.password = await createPassword(input.password);
      return await UserModel.create(input);
    },
    createCategory: async (_, { input }) => {
      const category = await CategoryModel.findOne({ name: input.name });
      if (category) return new ApolloError("Category already exist!");
      return await CategoryModel.create(input);
    },
    createPost: async (_, { input }) => {
      return await PostModel.create(input);
    },
  },
};
