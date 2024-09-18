import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";

export default mergeResolvers([userResolver]);
