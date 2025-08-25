import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to upload images to Supabase Storage
export async function uploadImage(file: File, folder: string = 'events'): Promise<string> {
  try {
    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }
    
    // Generate unique filename with optimization hint
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `${folder}/${timestamp}_${randomString}.${fileExtension}`;
    
    // Upload file to Supabase Storage with optimization metadata
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filename, file, {
        cacheControl: '31536000', // 1 year cache for better performance
        upsert: false,
        contentType: file.type
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    if (!data?.path) {
      throw new Error('Upload succeeded but no file path returned');
    }

    // Get public URL with optimization parameters
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to generate public URL for uploaded image');
    }

    // Return optimized URL with parameters for faster loading
    let publicUrl = urlData.publicUrl;
    
    // Remove any existing query parameters
    if (publicUrl.includes('?')) {
      publicUrl = publicUrl.split('?')[0];
    }
    
    // Ensure HTTPS
    if (publicUrl.startsWith('http://')) {
      publicUrl = publicUrl.replace('http://', 'https://');
    }

    // Add optimization parameters for faster loading
    const optimizationParams = new URLSearchParams({
      quality: '80',
      format: 'webp',
      width: '800'
    });

    return `${publicUrl}?${optimizationParams.toString()}`;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}

// Helper function to delete images from Supabase Storage
export async function deleteImage(url: string): Promise<void> {
  try {
    // Extract the file path from the URL
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const filePath = `${folder}/${filename}`;

    const { error } = await supabase.storage
      .from('images')
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    console.error('Image deletion error:', error);
    throw error;
  }
}
