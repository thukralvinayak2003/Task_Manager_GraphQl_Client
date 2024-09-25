import { graphqlClient } from "@/clients/api";
import { createTask, deleteTask, updateTask } from "@/graphql/mutation/task";
import { getTask } from "@/graphql/query/task";
import {
  useQuery,
  useMutation,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";

// Hook to fetch tasks
export const useGetTask = () => {
  const query = useQuery({
    queryKey: ["all-task"],
    queryFn: () => graphqlClient.request(getTask),
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });

  return {
    tasks: query.data?.getTask,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

// Hook to create a task
export const useCreateTask = () => {
  const queryClient = useQueryClient(); // Get access to the cache

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      graphqlClient.request(createTask, { payload }), // Send mutation request

    onSuccess: () => {
      queryClient.invalidateQueries(["all-task"] as InvalidateQueryFilters); // Refetch tasks after successful mutation
    },
  });

  return {
    createTask: mutation.mutate, // Function to trigger task creation
    status: mutation.status, // Check mutation status
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    isLoading: mutation.status === "pending", // Equivalent to ispending
  };
};

// Hook to update a task
export const useUpdateTask = () => {
  const queryClient = useQueryClient(); // Get access to the cache

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      graphqlClient.request(updateTask, { updateTaskId: id, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries(["all-task"] as InvalidateQueryFilters); // Refetch tasks after successful mutation
    },
  });

  return {
    updateTask: mutation.mutate, // Function to trigger task update
    status: mutation.status, // Check mutation status
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    isUpdatePending: mutation.status === "pending", // Equivalent to ispending
  };
};

// Hook to delete a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient(); // Get access to the cache

  const mutation = useMutation({
    mutationFn: (id: string) =>
      graphqlClient.request(deleteTask, { deleteTaskId: id }), // Send mutation request

    onSuccess: () => {
      queryClient.invalidateQueries(["all-task"] as InvalidateQueryFilters); // Refetch tasks after successful deletion
    },
  });

  return {
    deleteTask: mutation.mutate, // Function to trigger task deletion
    status: mutation.status, // Check mutation status
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    isDeletePending: mutation.status === "pending", // Equivalent to isLoading
  };
};
