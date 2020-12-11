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
    phone: Int!
    picture: File
    biography: String
    posts: [Post]
    token: String
  }

  type Post {
    id: ID!
    city: String!
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
    phone: Int!
    picture: Upload
    biography: String
  }

  input _post {
    city: String!
    category: _category!
    title: String!
    description: String
    price: Int!
    photos: [Upload!]
    deleted: Boolean
  }

  type Mutation{
    adduser(input: _user) : User!
    addcategory(input: _category) : Category!
    addpost(input: _post) : Post!
  }
`;
