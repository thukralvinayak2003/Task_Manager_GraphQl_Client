import { graphqlClient } from "@/clients/api";
import { createTask, deleteTask, updateTask } from "@/graphql/mutation/task";
import { getTask } from "@/graphql/query/task";
import {
  useQuery,
  useMutation,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

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
// Hook to create a task
export const useCreateTask = () => {
  const queryClient = useQueryClient(); // Get access to the cache

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      graphqlClient.request(createTask, { payload }), // Send mutation request

    onMutate: () => {
      // Show loading toast
      const toastId = toast.loading("Creating Task...");
      return toastId; // Return the toast ID
    },

    onSuccess: (data, variables, context) => {
      // Dismiss the loading toast
      toast.dismiss(context);
      queryClient.invalidateQueries(["all-task"] as InvalidateQueryFilters); // Refetch tasks after successful mutation
    },

    onError: (error, variables, context) => {
      toast.dismiss(context);
      toast.error("Failed to create task"); // Show error message
    },
  });

  return {
    createTask: mutation.mutate, // Function to trigger task creation
  };
};

// Hook to update a task
export const useUpdateTask = () => {
  const queryClient = useQueryClient(); // Get access to the cache

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      graphqlClient.request(updateTask, { updateTaskId: id, payload }),

    onMutate: () => {
      const toastId = toast.loading("Updating Task...");
      return toastId;
    },

    onSuccess: () => {
      toast.dismiss();
      queryClient.invalidateQueries(["all-task"] as InvalidateQueryFilters); // Refetch tasks after successful mutation
    },

    onError: () => {
      toast.dismiss();
      toast.error("Failed to update task");
    },
  });

  return {
    updateTask: mutation.mutate, // Function to trigger task update
  };
};

// Hook to delete a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient(); // Get access to the cache

  const mutation = useMutation({
    mutationFn: (id: string) =>
      graphqlClient.request(deleteTask, { deleteTaskId: id }), // Send mutation request

    onMutate: () => {
      // Show loading toast
      const toastId = toast.loading("Deleting Task...");
      return toastId; // Return the toast ID
    },

    onSuccess: () => {
      // Dismiss the loading toast
      toast.dismiss();
      queryClient.invalidateQueries(["all-task"] as InvalidateQueryFilters); // Refetch tasks after successful deletion
    },

    onError: () => {
      // Dismiss the loading toast on error
      toast.dismiss();
      toast.error("Failed to delete task"); // Show error message
    },
  });

  return {
    deleteTask: mutation.mutate, // Function to trigger task deletion
  };
};
