import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDef.js";

export default mergeTypeDefs([userTypeDef]);
