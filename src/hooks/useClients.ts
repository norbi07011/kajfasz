import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '../api/client';
import type { ClientData, ApiResponse } from '../api/types';

// Query keys
export const clientsKeys = {
  all: ['clients'] as const,
  lists: () => [...clientsKeys.all, 'list'] as const,
  list: (trainerId?: string) => [...clientsKeys.lists(), { trainerId }] as const,
  details: () => [...clientsKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientsKeys.details(), id] as const,
};

// Get all clients
export const useClients = (trainerId?: string) => {
  return useQuery({
    queryKey: clientsKeys.list(trainerId),
    queryFn: async () => {
      const response = await clientsApi.getAll();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get client by ID
export const useClient = (id: string) => {
  return useQuery({
    queryKey: clientsKeys.detail(id),
    queryFn: async () => {
      const response = await clientsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create client mutation
export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      // Invalidate and refetch clients list
      queryClient.invalidateQueries({ queryKey: clientsKeys.lists() });
    },
  });
};

// Update client mutation
export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientData> }) =>
      clientsApi.update(id, data),
    onSuccess: (data, variables) => {
      // Update the specific client in cache
      queryClient.setQueryData(clientsKeys.detail(variables.id), data.data);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: clientsKeys.lists() });
    },
  });
};

// Delete client mutation
export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => {
      // Invalidate and refetch clients list
      queryClient.invalidateQueries({ queryKey: clientsKeys.lists() });
    },
  });
};