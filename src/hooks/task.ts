import { graphqlClient } from "@/clients/api";
import { getTask } from "@/graphql/query/task";
import { useQuery } from "@tanstack/react-query";

export const useGetTask = () => {
  const query = useQuery({
    queryKey: ["all-task"],
    queryFn: () => graphqlClient.request(getTask),
    staleTime: 5 * 60 * 1000,
  });
  return {
    tasks: query.data?.getTask,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
