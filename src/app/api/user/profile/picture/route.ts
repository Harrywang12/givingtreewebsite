import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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

    // Generate unique filename for profile picture
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `profile_${userId}_${timestamp}.${fileExtension}`;
    console.log('Generated filename:', filename);
    
    // Convert file to buffer
    console.log('Converting file to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('File converted to buffer, size:', buffer.length);
    
    // Ensure the uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    console.log('Uploads directory path:', uploadsDir);
    try {
      await mkdir(uploadsDir, { recursive: true });
      console.log('Uploads directory ensured');
    } catch (mkdirError) {
      console.log('Directory creation error (might already exist):', mkdirError);
      // Directory might already exist, continue
    }
    
    // Save the file
    const filePath = join(uploadsDir, filename);
    console.log('Saving file to:', filePath);
    await writeFile(filePath, buffer);
    console.log('File saved successfully');
    
    // Get the old avatar path to delete it later
    const oldUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true }
    });
    
    // Update user profile with new avatar path
    const avatarPath = `/uploads/${filename}`;
    console.log('Updating user profile with new avatar path:', avatarPath);
    
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarPath }
    });
    
    console.log('User profile updated successfully');
    
    // Delete old avatar file if it exists and is a local upload
    if (oldUser?.avatar && oldUser.avatar.startsWith('/uploads/')) {
      try {
        const oldFilePath = join(process.cwd(), 'public', oldUser.avatar);
        console.log('Deleting old avatar file:', oldFilePath);
        await writeFile(oldFilePath, ''); // Clear the file
        console.log('Old avatar file deleted successfully');
      } catch (deleteError) {
        console.log('Failed to delete old avatar file:', deleteError);
        // Continue even if deletion fails
      }
    }

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
    
    // Delete the avatar file if it exists and is a local upload
    if (currentUser?.avatar && currentUser.avatar.startsWith('/uploads/')) {
      try {
        const filePath = join(process.cwd(), 'public', currentUser.avatar);
        await writeFile(filePath, ''); // Clear the file
      } catch (deleteError) {
        console.log('Failed to delete avatar file:', deleteError);
        // Continue even if deletion fails
      }
    }

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
