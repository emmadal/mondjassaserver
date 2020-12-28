import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    posts: [Post!]
    post(title: String!): [Post!]!
    users: [User!]!
    me: User
    categories: [Category!]
    category(id: String!): Category!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    phone: String!
    imageUrl: String
    biography: String
    posts: [ID!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Post {
    id: ID!
    city: String!
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
  }

  input _post {
    city: String!
    category: String!
    title: String!
    description: String
    price: Int!
    photos: [String!]
    deleted: Boolean
  }

  type Mutation {
    createUser(input: _user!): User!
    login(email: String!, password: String!): AuthPayload!
    createCategory(input: _category!): Category!
    createPost(input: _post!): Post!
    deletePost(id: ID!): [Post!]
    updatePost(id: ID!, input: _post!): Post!
  }
`;