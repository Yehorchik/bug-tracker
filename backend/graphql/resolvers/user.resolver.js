import { users } from "../../dummyData.js";

const userResolver = {
  Query: {
    authUser: (_, __, context) => {
      if (!context.user) {
        throw new Error("Not authorized");
      }

      return users.find((user) => user._id === userId);
    },
  },
  // Mutation: {},
};

export default userResolver;
