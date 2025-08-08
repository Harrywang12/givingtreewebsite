#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ADMIN_EMAILS = [
  'wangharrison2009@gmail.com',
  'givingtreenonprofit@gmail.com'
]

async function setupAdminSystem() {
  try {
    console.log('🚀 Setting up admin system...')
    
    // Check if admin users exist and grant roles
    for (const email of ADMIN_EMAILS) {
      const user = await prisma.user.findUnique({
        where: { email }
      })
      
      if (user) {
        const role = email === 'wangharrison2009@gmail.com' ? 'SUPER_ADMIN' : 'ADMIN'
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: role as any,
            isActive: true,
            loginAttempts: 0,
            lockedUntil: null
          }
        })
        
        console.log(`✅ Updated ${email} to ${role}`)
      } else {
        console.log(`⚠️ User ${email} not found - they need to register first`)
      }
    }
    
    console.log('🎉 Admin system setup completed!')
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Admin users should register/login to activate their accounts')
    console.log('2. Admin panel will be available in the dashboard')
    console.log('3. Only admins can create events via the admin panel')
    console.log('')
    console.log('🔐 Security features enabled:')
    console.log('- Account lockout after 5 failed login attempts')
    console.log('- Rate limiting on comments and likes')
    console.log('- Admin-only event creation')
    console.log('- Input sanitization and validation')
    console.log('- Active user verification')
    
  } catch (error) {
    console.error('❌ Error setting up admin system:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  setupAdminSystem()
}

export { setupAdminSystem }
