import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    posts: [Post]!
    post(name: String!): [Post!]
    users: [User!]
    user(name: String!): User!
    categories: [Category!]
    category(name: String): Category!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    phone: String!
    picture: File
    biography: String
    posts: [Post]
    token: String
  }

  type Post {
    id: ID!
    city: String!
    currency: String!
    country: String!
    category: Category!
    title: String!
    description: String
    price: Int!
    photos: [File!]
    deleted: Boolean
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Category {
    id: ID!
    name: String!
  }

  input _category {
    name: String!
  }

  input _user {
    name: String!
    email: String!
    password: String!
    phone: String!
    picture: Upload
    biography: String
  }

  input _post {
    city: String!
    category: _category!
    currency: String!
    country: String!
    title: String!
    description: String
    price: Int!
    photos: [Upload!]
    deleted: Boolean
  }

  type Mutation {
    createUser(input: _user): User!
    createCategory(input: _category): Category!
    createPost(input: _post): Post!
  }
`;
