import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearData() {
  console.log('🗑️  Starting data cleanup...')
  
  try {
    // Clear data in reverse order of dependencies
    console.log('🗑️  Clearing likes...')
    await prisma.like.deleteMany({})
    
    console.log('🗑️  Clearing comments...')
    await prisma.comment.deleteMany({})
    
    console.log('🗑️  Clearing item donations...')
    await prisma.itemDonation.deleteMany({})
    
    console.log('🗑️  Clearing monetary donations...')
    await prisma.donation.deleteMany({})
    
    console.log('🗑️  Clearing events...')
    await prisma.event.deleteMany({})
    
    console.log('🗑️  Clearing newsletter subscriptions...')
    await prisma.newsletter.deleteMany({})
    
    console.log('🗑️  Clearing users...')
    await prisma.user.deleteMany({})
    
    console.log('✅ All data cleared successfully!')
    console.log('📊 Database is now empty but structure remains intact.')
    
  } catch (error) {
    console.error('❌ Error clearing data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

clearData()
  .catch((error) => {
    console.error('❌ Failed to clear data:', error)
    process.exit(1)
  })
