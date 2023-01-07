const { gql } = require("apollo-server-express");

// We are defining the schemas that we defined for the mongoose, with all the types as well and required fields as well
// String, Number and all are called scalar type in GraphQL
//Query and Mutation are some default types on whose GraphQl runs
//User is an example of custom type
//AuthInput is an "input" type which is a mini type we can say but it is just a containier for defining the input varibles and fields

//Can have multiple input types like posts in Query

//We added related posts in Post to automatically fetch it when we fetch a particular post

const typeDefs = gql`
  type Query {
    user(id: ID!): User!
    isAuth: User!
    category(catId: ID!): Category!
    categories: [Category]!
    post(id: ID!): Post!
    posts(sort: SortInput, query: QueryByInput): [Post!]!
  }

  type Mutation {
    authUser(fields: AuthInput!): User!
    signUp(fields: AuthInput!): User!
    updateUserProfile(name: String, lastname: String): User!
    updateUserEmailPass(email: String!, password: String): User!
    createPost(fields: PostInput): Post!
    updatePost(fields: PostInput, postId: ID!): Post!
    deletePost(postId: ID): Boolean
    createCategory(name: String!): Category!
    updateCategory(catId: ID!, name: String!): Category!
    deleteCategory(catId: ID!): Boolean
  }

  type User {
    _id: ID!
    email: String!
    password: String!
    name: String
    lastname: String
    token: String
    posts(sort: SortInput): [Post!]!
    categories: [Category!]!
  }
  type Post {
    _id: ID!
    title: String!
    excerpt: String!
    content: String!
    created_at: String
    updated_at: String
    author: User!
    status: PostStatus
    category: Category
    related(sort: SortInput): [Post!]
  }

  type Category {
    _id: ID!
    name: String!
    author: User!
    posts: [Post]
  }

  input AuthInput {
    email: String!
    password: String!
  }

  input PostInput {
    title: String!
    excerpt: String!
    content: String!
    status: PostStatus
    category: ID
  }

  input SortInput {
    sortBy: String
    order: String
    limit: Int
    skip: Int
  }

  input QueryByInput {
    key: String!
    value: String!
  }

  enum PostStatus {
    Public
    Draft
  }
`;

module.exports = typeDefs;
