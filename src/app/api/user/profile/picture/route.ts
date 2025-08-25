import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Profile picture upload request received');
    
    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      console.log('No authorization token provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyAuth(token);
    if (!userId) {
      console.log('Invalid token, userId:', userId);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    console.log('User authenticated, userId:', userId);

    // Parse form data (multipart/form-data)
    console.log('Parsing form data...');
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      console.log('No file provided in form data');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Check file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File size too large:', file.size);
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Upload image to Supabase Storage
    console.log('Uploading image to Supabase...');
    const imageUrl = await uploadImage(file, 'profiles');
    console.log('Image uploaded to Supabase:', imageUrl);
    
    // Get the old avatar to check if it needs cleanup
    const oldUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true }
    });
    
    // Update user profile with new avatar URL
    console.log('Updating user profile with new avatar URL');
    
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: imageUrl }
    });
    
    console.log('User profile updated successfully');
    
    // Delete old avatar from Supabase if it exists
    if (oldUser?.avatar && oldUser.avatar.includes('supabase.co')) {
      try {
        await deleteImage(oldUser.avatar);
        console.log('Old avatar deleted from Supabase');
      } catch (deleteError) {
        console.log('Failed to delete old avatar from Supabase:', deleteError);
        // Continue even if deletion fails
      }
    }
    
    console.log('Profile picture updated successfully (Supabase storage)');

    return NextResponse.json({ 
      success: true,
      message: 'Profile picture updated successfully'
    });
    
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Failed to upload profile picture', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Endpoint to delete profile picture
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyAuth(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get the current avatar path before removing it
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true }
    });
    
    // Remove profile picture from database
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: null }
    });
    
    // Delete the avatar from Supabase if it exists
    if (currentUser?.avatar && currentUser.avatar.includes('supabase.co')) {
      try {
        await deleteImage(currentUser.avatar);
        console.log('Avatar deleted from Supabase');
      } catch (deleteError) {
        console.log('Failed to delete avatar from Supabase:', deleteError);
        // Continue even if deletion fails
      }
    }
    
    console.log('Profile picture removed successfully (Supabase storage)');

    return NextResponse.json({ 
      success: true,
      message: 'Profile picture removed successfully'
    });
    
  } catch (error) {
    console.error('Error removing profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to remove profile picture' },
      { status: 500 }
    );
  }
}
