import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Upload } from 'lucide-react';
import { AssetCard } from './AssetCard';
import { useAssets, useTags, useDeleteAsset } from '@/hooks/useAssets';
import { Asset } from '@/types/asset';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const AssetGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  const { data: assets, isLoading: assetsLoading } = useAssets(searchTerm, selectedTags);
  const { data: tags } = useTags();

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  const downloadAsset = async (asset: Asset) => {
    try {
      const { data, error } = await supabase.storage
        .from('assets')
        .download(asset.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = asset.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `${asset.filename} is being downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Asset Gallery</h1>
        <p className="text-muted-foreground">
          Browse and discover digital assets
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search assets by filename or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tag Filters */}
        {tags && tags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter by tags:</span>
              {selectedTags.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  style={selectedTags.includes(tag.id) ? { backgroundColor: tag.color } : {}}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {assetsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : assets && assets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="group cursor-pointer relative aspect-[4/5] bg-muted rounded-lg overflow-hidden hover:shadow-lg transition-all"
              onClick={() => setSelectedAsset(asset)}
            >
              <div className="w-full h-full flex items-center justify-center text-6xl">
                {asset.file_type.startsWith('image/') ? '🖼️' :
                 asset.file_type.startsWith('video/') ? '🎥' : 
                 asset.file_type.startsWith('audio/') ? '🎵' : '📄'}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                <h3 className="font-medium text-sm truncate">{asset.filename}</h3>
                <p className="text-xs opacity-75">
                  {(asset.file_size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">No assets found</div>
          <p className="text-sm text-muted-foreground mt-2">
            {searchTerm || selectedTags.length > 0
              ? "Try adjusting your search or filters"
              : "Upload your first asset to get started"}
          </p>
        </div>
      )}

      {/* Asset Detail Modal */}
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedAsset && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAsset.filename}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    {selectedAsset.file_type.startsWith('image/') ? (
                      <img 
                        src={`https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop`}
                        alt={selectedAsset.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-8xl">
                        {selectedAsset.file_type.startsWith('video/') ? '🎥' : 
                         selectedAsset.file_type.startsWith('audio/') ? '🎵' : '📄'}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Details</h3>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">File size:</dt>
                          <dd>{selectedAsset.file_size.toLocaleString()} bytes</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Type:</dt>
                          <dd>{selectedAsset.file_type}</dd>
                        </div>
                        {selectedAsset.width && selectedAsset.height && (
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Dimensions:</dt>
                            <dd>{selectedAsset.width} × {selectedAsset.height}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Created:</dt>
                          <dd>{new Date(selectedAsset.created_at).toLocaleDateString()}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    {selectedAsset.description && (
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground">{selectedAsset.description}</p>
                      </div>
                    )}
                    
                    {selectedAsset.tags && selectedAsset.tags.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedAsset.tags.map((tag) => (
                            <Badge 
                              key={tag.id}
                              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={() => downloadAsset(selectedAsset)} className="gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Download
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};