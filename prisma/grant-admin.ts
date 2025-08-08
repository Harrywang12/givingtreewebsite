import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ADMIN_EMAILS = [
  'wangharrison2009@gmail.com',
  'givingtreenonprofit@gmail.com'
]

async function grantAdminRoles() {
  try {
    console.log('🔐 Granting admin roles to approved emails...')
    
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
            isActive: true
          }
        })
        
        console.log(`✅ Granted ${role} role to: ${email}`)
      } else {
        console.log(`⚠️ User not found for email: ${email}`)
        console.log(`   This user needs to register first before becoming admin`)
      }
    }
    
    console.log('🎉 Admin role assignment completed!')
    
  } catch (error) {
    console.error('❌ Error granting admin roles:', error)
  } finally {
    await prisma.$disconnect()
  }
}

grantAdminRoles()
