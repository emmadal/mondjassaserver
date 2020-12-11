import { gql } from 'apollo-server'

export const typeDefs = gql`
  
  type Query {
      posts: [Posts]!
      post(name: String!): [Posts]!
      users: [User]
      user(name: String!): User!
      categories: [Category]!
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
  }

  type Post {
      id: ID!
      city: String!
      category: Category!
      title: String!
      description: String
      price: Int!
      photos: [File]!
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Category{
      id: ID!
      name: String!
  }
`;
