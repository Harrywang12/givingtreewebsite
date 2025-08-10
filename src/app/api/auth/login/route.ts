import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Normalize email
    const normalizedEmail = String(email).toLowerCase().trim()

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json(
        { error: 'Account temporarily locked due to multiple failed login attempts. Please try again later.' },
        { status: 423 }
      )
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account has been deactivated. Please contact support.' },
        { status: 403 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      // Increment failed login attempts
      const newLoginAttempts = (user.loginAttempts || 0) + 1;
      const lockDuration = newLoginAttempts >= 5 ? 30 * 60 * 1000 : null; // 30 minutes after 5 attempts
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: newLoginAttempts,
          lockedUntil: lockDuration ? new Date(Date.now() + lockDuration) : null
        }
      });

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Reset failed login attempts and update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date()
      }
    });

    // Generate token
    const token = generateToken(user.id)

    // Return user data (without password) and token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 