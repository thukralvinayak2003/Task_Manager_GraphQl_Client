import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

export const graphqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_URL!, {
  headers: () => ({
    Authorization: isClient
      ? `Bearer ${window.localStorage.getItem("googleToken")}`
      : "",
  }),
});
