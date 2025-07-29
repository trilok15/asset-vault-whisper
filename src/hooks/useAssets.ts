import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Asset, Tag } from '@/types/asset';

export const useAssets = (searchTerm?: string, selectedTags?: string[]) => {
  return useQuery({
    queryKey: ['assets', searchTerm, selectedTags],
    queryFn: async () => {
      let query = supabase
        .from('assets')
        .select(`
          *,
          asset_tags!inner(
            tag_id,
            tags!inner(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`filename.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (selectedTags && selectedTags.length > 0) {
        query = query.in('asset_tags.tag_id', selectedTags);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform the data to include tags
      const assets: Asset[] = data?.map((asset: any) => ({
        ...asset,
        tags: asset.asset_tags?.map((at: any) => at.tags) || []
      })) || [];

      return assets;
    },
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Tag[];
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assetId: string) => {
      // First delete from storage
      const { data: asset } = await supabase
        .from('assets')
        .select('file_path')
        .eq('id', assetId)
        .single();
      
      if (asset?.file_path) {
        await supabase.storage
          .from('assets')
          .remove([asset.file_path]);
      }
      
      // Then delete from database (cascades to asset_tags)
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tag: Omit<Tag, 'id' | 'created_at'>) => {
      const { error } = await supabase
        .from('tags')
        .insert([tag]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};