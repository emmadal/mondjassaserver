import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    posts: [Post!]
    post(title: String!): [Post!]!
    users: [User!]!
    user(name: String!): [User!]!
    categories: [Category!]
    category(id: ID!): Category!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    phone: String!
    imageUrl: String
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
    photos: [String!]
    user: User!
    date: String!
    deleted: Boolean
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
    imageUrl: String
    biography: String
  }

  input _post {
    city: String!
    category: String!
    currency: String!
    country: String!
    title: String!
    description: String
    price: Int!
    photos: [String!]
    deleted: Boolean
  }

  type Mutation {
    createUser(input: _user!): User!
    createCategory(input: _category!): Category!
    createPost(input: _post!): Post!
    deletePost(id: ID!): [Post!]
    updatePost(id: ID!, input: _post!): Post!
    login(email: String!, password: String!): User!
  }
`;