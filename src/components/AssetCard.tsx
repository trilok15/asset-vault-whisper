import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Download, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Asset } from '@/types/asset';
import { formatBytes } from '@/lib/utils';

interface AssetCardProps {
  asset: Asset;
  onDelete: (id: string) => void;
  onView: (asset: Asset) => void;
}

export const AssetCard = ({ asset, onDelete, onView }: AssetCardProps) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    return '📄';
  };

  const getPreviewUrl = (filePath: string) => {
    // For demo purposes, using placeholder images
    const placeholders = [
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1500673922987-e212871f16ac?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1498936178812-4b2e558d2937?w=400&h=300&fit=crop',
    ];
    return placeholders[Math.abs(filePath.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % placeholders.length];
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="relative aspect-video mb-3 overflow-hidden rounded-lg bg-muted">
          {asset.file_type.startsWith('image/') ? (
            <img 
              src={getPreviewUrl(asset.file_path)}
              alt={asset.filename}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {getFileIcon(asset.file_type)}
            </div>
          )}
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(asset)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(asset.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <h3 className="font-medium text-sm truncate" title={asset.filename}>
              {asset.filename}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatBytes(asset.file_size)} • {asset.file_type}
            </p>
          </div>
          
          {asset.tags && asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {asset.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="secondary" 
                  className="text-xs"
                  style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
              {asset.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{asset.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};