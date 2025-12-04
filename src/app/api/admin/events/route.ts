import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminFromRequest, logAdminAction, validateEventData, ADMIN_SECURITY_HEADERS } from '@/lib/admin';
import { rateLimit } from '@/lib/redis';
import { uploadImage } from '@/lib/supabase';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for admin event creation
    logger.log('Checking rate limit...');
    try {
      const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      const rateLimitKey = `admin_event_${clientIp}`;
      logger.log('Rate limit key:', rateLimitKey);
      const isAllowed = await rateLimit.check(rateLimitKey, 10, 3600); // 10 events per hour
      
      if (!isAllowed) {
        logger.log('Rate limit exceeded');
        return NextResponse.json(
          { error: 'Too many event creation attempts. Please try again later.' },
          { status: 429, headers: ADMIN_SECURITY_HEADERS }
        );
      }
      logger.log('Rate limit check passed');
    } catch (rateLimitError) {
      logger.log('Rate limiting error, continuing without rate limit:', rateLimitError);
      // Continue without rate limiting if Redis is not available
    }

    // Verify admin access
    logger.log('Verifying admin access...');
    let admin;
    try {
      admin = await verifyAdminFromRequest(request);
      if (!admin) {
        logger.log('Admin verification failed');
        try {
          await logAdminAction('unknown', 'FAILED_EVENT_CREATE', 'events', { reason: 'Invalid admin access' });
        } catch (logError) {
          logger.log('Failed to log admin access failure, continuing:', logError);
        }
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403, headers: ADMIN_SECURITY_HEADERS }
        );
      }
      logger.log('Admin verified:', admin.email);
    } catch (adminError) {
      logger.log('Admin verification error:', adminError);
      return NextResponse.json(
        { error: 'Admin verification failed' },
        { status: 500, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Parse and validate request data
    let requestData;
    let imageFile: File | null = null;
    
    // Check if the request contains form data (file upload) or JSON
    const contentType = request.headers.get('content-type') || '';
    logger.log('🔍 Request debug:');
    logger.log('- Content-Type:', contentType);
    logger.log('- Is multipart/form-data:', contentType.includes('multipart/form-data'));
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      logger.log('Processing multipart form data...');
      const formData = await request.formData();
      
      // Log all form data keys
      logger.log('FormData keys:', Array.from(formData.keys()));
      
      const dateValue = formData.get('date') as string;
      const titleValue = formData.get('title') as string;
      const descriptionValue = formData.get('description') as string;
      const contentValue = formData.get('content') as string;
      const typeValue = formData.get('type') as string;
      const locationValue = formData.get('location') as string;
      const imageUrlValue = formData.get('imageUrl') as string;
      
      logger.log('Individual form values:', {
        date: dateValue,
        title: titleValue,
        description: descriptionValue,
        content: contentValue,
        type: typeValue,
        location: locationValue,
        imageUrl: imageUrlValue
      });
      
      requestData = {
        title: titleValue,
        description: descriptionValue,
        content: contentValue,
        date: dateValue || '', // Keep the date as is, let validation handle it
        type: typeValue,
        location: locationValue,
        imageUrl: imageUrlValue || ''
      };
      
      logger.log('FormData parsed:', requestData);
      
      // Get the uploaded file
      const file = formData.get('imageFile') as File;
      logger.log('🔍 Form data debug:');
      logger.log('- All form data keys:', Array.from(formData.keys()));
      logger.log('- imageFile key exists:', formData.has('imageFile'));
      logger.log('- file object:', file);
      logger.log('- file type:', typeof file);
      logger.log('- file instanceof File:', file instanceof File);
      
      if (file && file.size > 0) {
        imageFile = file;
        logger.log('✅ Image file found:', file.name, file.size, file.type);
      } else {
        logger.log('❌ No image file found or file is empty');
        logger.log('- file size:', file?.size);
        logger.log('- file name:', file?.name);
      }
    } else {
      // Handle JSON data
      requestData = await request.json();
      logger.log('JSON data parsed:', requestData);
    }
    
    logger.log('Final requestData:', requestData);
    const validation = validateEventData(requestData);
    logger.log('Validation result:', validation);
    
    if (!validation.isValid) {
      logger.log('Validation failed:', validation.errors);
      // Note: We can't log admin action here since admin verification hasn't happened yet
      // This is a validation error, not an admin action failure
      return NextResponse.json(
        { error: 'Invalid event data', details: validation.errors },
        { status: 400, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Handle image upload if present
    let finalImageUrl = validation.sanitized!.imageUrl;
    
    logger.log('🔍 Image upload debug:');
    logger.log('- imageFile exists:', !!imageFile);
    logger.log('- imageFile name:', imageFile?.name);
    logger.log('- imageFile size:', imageFile?.size);
    logger.log('- imageFile type:', imageFile?.type);
    
    if (imageFile) {
      try {
        logger.log('Processing image upload to Supabase...');
        
        // Upload image to Supabase Storage
        const imageUrl = await uploadImage(imageFile, 'events');
        finalImageUrl = imageUrl;
        
        logger.log('✅ Image uploaded to Supabase:', imageUrl);
        
      } catch (imageError) {
        logger.error('❌ Supabase image upload error:', imageError);
        logger.error('Error details:', {
          message: imageError instanceof Error ? imageError.message : 'Unknown error',
          stack: imageError instanceof Error ? imageError.stack : undefined
        });
        
        // Try to log the admin action failure
        try {
          await logAdminAction(admin.id, 'FAILED_EVENT_CREATE', 'events', { 
            reason: 'Image upload failed', 
            error: imageError instanceof Error ? imageError.message : 'Unknown image error'
          });
        } catch (logError) {
          logger.log('Failed to log image upload failure, continuing:', logError);
        }
        
        // Continue without image if upload fails
        finalImageUrl = validation.sanitized!.imageUrl || '';
        logger.log('⚠️ Continuing without image, finalImageUrl:', finalImageUrl);
      }
    } else {
      logger.log('ℹ️ No image file provided, using existing imageUrl:', finalImageUrl);
    }
    
    logger.log('Creating event in database with data:', {
      ...validation.sanitized!,
      imageUrl: finalImageUrl,
      authorId: admin.id
    });
    
    // Create event in database
    let event;
    try {
      event = await prisma.event.create({
        data: {
          ...validation.sanitized!,
          imageUrl: finalImageUrl,
          authorId: admin.id
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        }
      });
      
      logger.log('Event created successfully:', event.id);
    } catch (dbError) {
      logger.error('Database creation error:', dbError);
      
      // Try to log the admin action failure
      try {
        await logAdminAction(admin.id, 'FAILED_EVENT_CREATE', 'events', { 
          reason: 'Database creation failed', 
          error: dbError instanceof Error ? dbError.message : 'Unknown database error'
        });
      } catch (logError) {
        logger.log('Failed to log database creation failure, continuing:', logError);
      }
      
      return NextResponse.json(
        { error: 'Failed to create event in database' },
        { status: 500, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Log successful admin action
    try {
      await logAdminAction(admin.id, 'CREATE_EVENT', 'events', {
        eventId: event.id,
        title: event.title,
        type: event.type
      });
      logger.log('Admin action logged successfully');
    } catch (logError) {
      logger.log('Failed to log admin action, continuing:', logError);
    }

    try {
      return NextResponse.json({
        message: 'Event created successfully',
        event: {
          id: event.id,
          title: event.title,
          description: event.description,
          content: event.content,
          date: event.date,
          type: event.type,
          location: event.location,
          imageUrl: event.imageUrl,
          isActive: event.isActive,
          author: event.author,
          commentCount: event._count.comments,
          likeCount: event._count.likes,
          createdAt: event.createdAt
        }
      }, { 
        status: 201,
        headers: ADMIN_SECURITY_HEADERS
      });
    } catch (responseError) {
      logger.error('Error creating response:', responseError);
      
      // Try to log the admin action failure
      try {
        await logAdminAction(admin.id, 'FAILED_EVENT_CREATE', 'events', { 
          reason: 'Response creation failed', 
          error: responseError instanceof Error ? responseError.message : 'Unknown response error'
        });
      } catch (logError) {
        logger.log('Failed to log response creation failure, continuing:', logError);
      }
      
      return NextResponse.json(
        { error: 'Failed to create response' },
        { status: 500, headers: ADMIN_SECURITY_HEADERS }
      );
    }

  } catch (error) {
    logger.error('Admin event creation error:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      logger.error('Error message:', error.message);
      logger.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin access for getting all events (including inactive)
    const admin = await verifyAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403, headers: ADMIN_SECURITY_HEADERS }
      );
    }

    // Get active events with admin details
    const events = await prisma.event.findMany({
      where: {
        isActive: true
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    });

    await logAdminAction(admin.id, 'VIEW_ALL_EVENTS', 'events', { count: events.length });

    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      content: event.content,
      date: event.date,
      type: event.type,
      location: event.location,
      imageUrl: event.imageUrl,
      isActive: event.isActive,
      author: event.author,
      commentCount: event._count.comments,
      likeCount: event._count.likes,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }));

    return NextResponse.json({
      events: formattedEvents
    }, {
      headers: ADMIN_SECURITY_HEADERS
    });

  } catch (error) {
    logger.error('Admin get events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: ADMIN_SECURITY_HEADERS }
    );
  }
}
