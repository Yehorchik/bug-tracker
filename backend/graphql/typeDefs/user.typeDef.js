const userTypeDef = `#graphql
  type User {
    _id: ID!
    firstName:String!
    lastName: String!
    email:String!
  }

  type Query {
    authUser: User
  }
`;

export default userTypeDef;
