import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { DestinationProps } from '@/types';

const getDestination = async (destination: string, page: number = 0) => {
  const response = await axios.get(
    `${
      import.meta.env.VITE_WONDERPLAN_API
    }/destinations?q=${destination}&page=${page}`,
  );
  return response.data as DestinationProps;
};

const useGetDestination = (query: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['destination', query],
    queryFn: () => getDestination(query),
    enabled: !!query,
  });

  return { data, isLoading };
};

export { useGetDestination };
