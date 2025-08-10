import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Normalize email to prevent case-sensitive duplicates
    const normalizedEmail = String(email).toLowerCase().trim()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Check if this is an admin email
    const adminEmails = ['wangharrison2009@gmail.com', 'givingtreenonprofit@gmail.com'];
    const isAdmin = adminEmails.includes(normalizedEmail);
    const role = isAdmin ? (normalizedEmail === 'wangharrison2009@gmail.com' ? 'SUPER_ADMIN' : 'ADMIN') : 'USER';

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: phone || null,
        password: hashedPassword,
        role: role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        totalDonated: true,
        itemsDonated: true,
        memberSince: true,
      }
    })

    // Log admin user creation
    if (isAdmin) {
      console.log(`🔐 Admin user registered: ${email} with role: ${role}`);
    }

    return NextResponse.json({
      message: 'User created successfully',
      user
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 