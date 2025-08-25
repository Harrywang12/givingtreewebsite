import { createClient } from '@supabase/supabase-js';

// Debug environment variables
console.log('🔍 Environment variables check:');
console.log('- process.env keys:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));
console.log('- NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase client initialization:');
console.log('- supabaseUrl:', supabaseUrl);
console.log('- supabaseAnonKey exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('- supabaseUrl:', supabaseUrl);
  console.error('- supabaseAnonKey:', supabaseAnonKey ? 'EXISTS' : 'MISSING');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('✅ Supabase client created successfully');

// Helper function to upload images to Supabase Storage
export async function uploadImage(file: File, folder: string = 'events'): Promise<string> {
  try {
    console.log('🔍 uploadImage function called:');
    console.log('- file name:', file.name);
    console.log('- file size:', file.size);
    console.log('- file type:', file.type);
    console.log('- folder:', folder);
    console.log('- supabaseUrl:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('- supabaseAnonKey exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `${folder}/${timestamp}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
    
    console.log('- generated filename:', filename);
    
    // Upload file to Supabase Storage
    console.log('- attempting upload to Supabase...');
    console.log('- storage bucket: images');
    console.log('- file path:', filename);
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    console.log('✅ Upload successful, data:', data);

    // Get public URL
    console.log('- getting public URL...');
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filename);

    console.log('✅ Public URL generated:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('❌ Image upload error:', error);
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
