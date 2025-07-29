export interface Asset {
  id: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  mime_type?: string;
  width?: number;
  height?: number;
  duration?: number;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface AssetTag {
  asset_id: string;
  tag_id: string;
}