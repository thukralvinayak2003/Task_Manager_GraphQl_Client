import { graphqlClient } from "@/clients/api";
import { getTask } from "@/graphql/query/task";
import { getCurrentUserQuery } from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: () => graphqlClient.request(getCurrentUserQuery),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    user: query.data?.getCurrentUser,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

