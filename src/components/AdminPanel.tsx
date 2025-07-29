import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Plus, Trash2, Edit, Database } from 'lucide-react';
import { useAssets, useTags, useCreateTag } from '@/hooks/useAssets';
import { toast } from '@/hooks/use-toast';

export const AdminPanel = () => {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);

  const { data: assets } = useAssets();
  const { data: tags } = useTags();
  const createTag = useCreateTag();

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      await createTag.mutateAsync({
        name: newTagName.trim(),
        color: newTagColor,
      });
      
      setNewTagName('');
      setNewTagColor('#3b82f6');
      setIsCreateTagOpen(false);
      
      toast({
        title: "Tag created",
        description: "New tag has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tag. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stats = {
    totalAssets: assets?.length || 0,
    totalTags: tags?.length || 0,
    totalSize: assets?.reduce((acc, asset) => acc + asset.file_size, 0) || 0,
    imageCount: assets?.filter(a => a.file_type.startsWith('image/')).length || 0,
    videoCount: assets?.filter(a => a.file_type.startsWith('video/')).length || 0,
    otherCount: assets?.filter(a => !a.file_type.startsWith('image/') && !a.file_type.startsWith('video/')).length || 0,
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage your CMS system and view analytics
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tags">Tag Management</TabsTrigger>
          <TabsTrigger value="assets">Asset Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAssets}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Size</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatBytes(stats.totalSize)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tags</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTags}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">File Types</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Images:</span>
                    <span>{stats.imageCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Videos:</span>
                    <span>{stats.videoCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Other:</span>
                    <span>{stats.otherCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Assets */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assets?.slice(0, 5).map((asset) => (
                  <div key={asset.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="text-2xl">
                      {asset.file_type.startsWith('image/') ? '🖼️' :
                       asset.file_type.startsWith('video/') ? '🎥' : '📄'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{asset.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(asset.file_size)} • {new Date(asset.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {asset.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tag Management</h2>
            <Dialog open={isCreateTagOpen} onOpenChange={setIsCreateTagOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Tag</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tagName">Tag Name</Label>
                    <Input
                      id="tagName"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagColor">Color</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="tagColor"
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateTagOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
                      Create Tag
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tags?.map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Asset Management</h2>
            <Button variant="outline">
              Bulk Operations
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {assets?.map((asset) => (
                  <div key={asset.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="text-3xl">
                      {asset.file_type.startsWith('image/') ? '🖼️' :
                       asset.file_type.startsWith('video/') ? '🎥' : '📄'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{asset.filename}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatBytes(asset.file_size)} • {asset.file_type}
                      </p>
                      {asset.description && (
                        <p className="text-sm text-muted-foreground mt-1">{asset.description}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {asset.tags?.map((tag) => (
                        <Badge 
                          key={tag.id} 
                          variant="outline" 
                          className="text-xs"
                          style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};