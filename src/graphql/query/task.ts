import { graphql } from "@/gql";

export const getTask = graphql(`
  #graphql
  query GetTask {
    getTask {
      id
      title
      description
      status
    }
  }
`);
