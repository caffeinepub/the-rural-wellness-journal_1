import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { BlogCategory, type BlogPost, type PortfolioItem, type UserProfile } from '../backend';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export function useGetAllBlogPosts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getAllBlogPosts();
      // Sort newest first
      return [...posts].sort((a, b) => Number(b.publishedDate - a.publishedDate));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetBlogPost(id: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBlogPost(id);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetBlogPostsByCategory(category: BlogCategory) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getBlogPostsByCategory(category);
      return [...posts].sort((a, b) => Number(b.publishedDate - a.publishedDate));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      body: string;
      category: BlogCategory;
      featuredImageUrl: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBlogPost(data.title, data.body, data.category, data.featuredImageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      body: string;
      category: BlogCategory;
      featuredImageUrl: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBlogPost(data.id, data.title, data.body, data.category, data.featuredImageUrl);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', variables.id.toString()] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBlogPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

// ─── Portfolio Items ──────────────────────────────────────────────────────────

export function useGetAllPortfolioItems() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PortfolioItem[]>({
    queryKey: ['portfolioItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPortfolioItems();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPortfolioItem(id: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PortfolioItem | null>({
    queryKey: ['portfolioItem', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPortfolioItem(id);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreatePortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      imageUrls: string[];
      location: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPortfolioItem(data.title, data.description, data.imageUrls, data.location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
    },
  });
}

export function useUpdatePortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      imageUrls: string[];
      location: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePortfolioItem(data.id, data.title, data.description, data.imageUrls, data.location);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
      queryClient.invalidateQueries({ queryKey: ['portfolioItem', variables.id.toString()] });
    },
  });
}

export function useDeletePortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePortfolioItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
    },
  });
}
