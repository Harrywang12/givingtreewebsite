import { NextRequest } from 'next/server';
import { verifyToken } from './auth';
import { prisma } from './prisma';

// Admin email addresses - only these can have admin access
const ADMIN_EMAILS = [
  'wangharrison2009@gmail.com',
  'givingtreenonprofit@gmail.com'
];

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

/**
 * Verify if a user is an admin based on their email and database role
 */
export async function verifyAdmin(token: string): Promise<AdminUser | null> {
  try {
    // First verify the JWT token
    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    // Get user from database with security checks
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        isActive: true, // Must be active
        // Ensure account is not locked
        OR: [
          { lockedUntil: null },
          { lockedUntil: { lt: new Date() } }
        ]
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lockedUntil: true,
        loginAttempts: true
      }
    });

    if (!user) {
      return null;
    }

    // Check if email is in admin list
    if (!ADMIN_EMAILS.includes(user.email)) {
      return null;
    }

    // Check if user has admin role in database
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return null;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        loginAttempts: 0 // Reset failed attempts on successful admin verification
      }
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'ADMIN' | 'SUPER_ADMIN'
    };

  } catch (error) {
    console.error('Admin verification error:', error);
    return null;
  }
}

/**
 * Middleware to verify admin access from request
 */
export async function verifyAdminFromRequest(request: NextRequest): Promise<AdminUser | null> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return null;
  }

  return await verifyAdmin(token);
}

/**
 * Grant admin role to a user (only for initial setup)
 */
export async function grantAdminRole(email: string): Promise<boolean> {
  try {
    // Only allow admin emails
    if (!ADMIN_EMAILS.includes(email)) {
      console.error(`Attempted to grant admin to non-approved email: ${email}`);
      return false;
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error(`User not found for admin grant: ${email}`);
      return false;
    }

    // Grant admin role
    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: email === 'wangharrison2009@gmail.com' ? 'SUPER_ADMIN' : 'ADMIN',
        isActive: true
      }
    });

    console.log(`Admin role granted to: ${email}`);
    return true;

  } catch (error) {
    console.error('Grant admin role error:', error);
    return false;
  }
}

/**
 * Security middleware for admin routes
 */
export function createAdminMiddleware(requiredRole: 'ADMIN' | 'SUPER_ADMIN' = 'ADMIN') {
  return async (request: NextRequest) => {
    const admin = await verifyAdminFromRequest(request);
    
    if (!admin) {
      return {
        error: 'Admin access required',
        status: 403
      };
    }

    // Check role hierarchy
    if (requiredRole === 'SUPER_ADMIN' && admin.role !== 'SUPER_ADMIN') {
      return {
        error: 'Super admin access required',
        status: 403
      };
    }

    return {
      admin,
      status: 200
    };
  };
}

/**
 * Rate limiting for admin actions
 */
export async function checkAdminRateLimit(): Promise<boolean> {
  try {
    // Implementation depends on your rate limiting strategy
    // For now, return true but you can add Redis-based rate limiting
    return true;
  } catch (error) {
    console.error('Admin rate limit check error:', error);
    return false;
  }
}

/**
 * Log admin actions for security audit
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  resource: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    console.log('Admin Action:', {
      adminId,
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
      ip: 'unknown' // Add IP tracking if needed
    });

    // You can extend this to write to a database table for audit logs
  } catch (error) {
    console.error('Admin action logging error:', error);
  }
}

/**
 * Sanitize and validate event data for admin posting
 */
interface EventInput {
  title?: string;
  description?: string;
  content?: string;
  date?: string;
  type?: string;
  location?: string;
  imageUrl?: string;
  isActive?: boolean;
}

interface SanitizedEventData {
  title: string;
  description: string;
  content: string | null;
  date: Date;
  type: 'NEWS' | 'EVENT' | 'ANNOUNCEMENT';
  location: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export function validateEventData(data: EventInput): {
  isValid: boolean;
  sanitized?: SanitizedEventData;
  errors?: string[];
} {
  const errors: string[] = [];
  
  // Required fields
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (!data.date || isNaN(new Date(data.date).getTime())) {
    errors.push('Valid date is required');
  }
  
  if (!data.type || !['NEWS', 'EVENT', 'ANNOUNCEMENT'].includes(data.type)) {
    errors.push('Valid event type is required');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Sanitize data
  const sanitized = {
    title: data.title.trim().substring(0, 200), // Limit title length
    description: data.description.trim().substring(0, 1000), // Limit description
    content: data.content ? data.content.trim().substring(0, 5000) : null, // Limit content
    date: new Date(data.date),
    type: data.type,
    location: data.location ? data.location.trim().substring(0, 200) : null,
    imageUrl: data.imageUrl && isValidUrl(data.imageUrl) ? data.imageUrl : null,
    isActive: Boolean(data.isActive ?? true)
  };

  return { isValid: true, sanitized };
}

/**
 * Validate URL for security
 */
function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    // Only allow HTTP/HTTPS URLs
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Security headers for admin responses
 */
export const ADMIN_SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
