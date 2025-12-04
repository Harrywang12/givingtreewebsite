import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/supabase';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.log('Profile picture upload request received');
    
    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      logger.log('No authorization token provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyAuth(token);
    if (!userId) {
      logger.log('Invalid token, userId:', userId);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    logger.log('User authenticated, userId:', userId);

    // Parse form data (multipart/form-data)
    logger.log('Parsing form data...');
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      logger.log('No file provided in form data');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    logger.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Check file type
    if (!file.type.startsWith('image/')) {
      logger.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      logger.log('File size too large:', file.size);
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Upload image to Supabase Storage
    logger.log('Uploading image to Supabase...');
    const imageUrl = await uploadImage(file, 'profiles');
    logger.log('Image uploaded to Supabase:', imageUrl);
    
    // Get the old avatar to check if it needs cleanup
    const oldUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true }
    });
    
    // Update user profile with new avatar URL
    logger.log('Updating user profile with new avatar URL');
    
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: imageUrl }
    });
    
    logger.log('User profile updated successfully');
    
    // Delete old avatar from Supabase if it exists
    if (oldUser?.avatar && oldUser.avatar.includes('supabase.co')) {
      try {
        await deleteImage(oldUser.avatar);
        logger.log('Old avatar deleted from Supabase');
      } catch (deleteError) {
        logger.log('Failed to delete old avatar from Supabase:', deleteError);
        // Continue even if deletion fails
      }
    }
    
    logger.log('Profile picture updated successfully (Supabase storage)');

    return NextResponse.json({ 
      success: true,
      message: 'Profile picture updated successfully'
    });
    
  } catch (error) {
    logger.error('Error uploading profile picture:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      logger.error('Error message:', error.message);
      logger.error('Error stack:', error.stack);
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
        logger.log('Avatar deleted from Supabase');
      } catch (deleteError) {
        logger.log('Failed to delete avatar from Supabase:', deleteError);
        // Continue even if deletion fails
      }
    }
    
    logger.log('Profile picture removed successfully (Supabase storage)');

    return NextResponse.json({ 
      success: true,
      message: 'Profile picture removed successfully'
    });
    
  } catch (error) {
    logger.error('Error removing profile picture:', error);
    return NextResponse.json(
      { error: 'Failed to remove profile picture' },
      { status: 500 }
    );
  }
}
