'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@wordsearch/config';

interface TopicsResponse {
  topics: string[];
}

const fetchTopics = async (): Promise<string[]> => {
  const { data } = await axios.get<TopicsResponse>(`${API_URL}/api/game/topics`);
  return data.topics;
};

export const useTopics = () => {
  return useQuery({
    queryKey: ['topics'],
    queryFn: fetchTopics,
    staleTime: Infinity, // Topics should not change frequently
  });
};
