import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Upload, Search, Settings, FileImage, Video, Music, FileText } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <Database className="h-16 w-16 mx-auto mb-4 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Asset Vault CMS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A powerful local-first digital asset management system. Organize, tag, and search through your images, videos, and files with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/gallery">
                <Search className="h-5 w-5" />
                Browse Gallery
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/admin">
                <Settings className="h-5 w-5" />
                Admin Panel
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Easy Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Drag and drop files or upload in bulk to quickly organize your assets
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Search className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Smart Search</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Find assets instantly with powerful search and tag-based filtering
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Local Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All your data stays on your network - fully offline and private
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Easy Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete CRUD operations with an intuitive admin interface
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Supported File Types */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-8">Supported File Types</h2>
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              <span>Images</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              <span>Videos</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              <span>Audio</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>Documents</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
