import { gql } from "graphql-request";

export const deleteTask = `
  mutation DeleteTask($deleteTaskId: String!) {
    deleteTask(id: $deleteTaskId)
  }
`;

export const createTask = gql`
  mutation CreateTask($payload: CreateTask!) {
    createTask(payload: $payload) {
      id
      title
      description
      status
      user {
        id
        firstname
      }
    }
  }
`;

export const updateTask = gql`
  mutation UpdateTask($updateTaskId: String!, $payload: UpdateTask!) {
    updateTask(id: $updateTaskId, payload: $payload) {
      title
    }
  }
`;
