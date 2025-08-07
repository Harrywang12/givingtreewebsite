import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'sarah.johnson@example.com' },
      update: {},
      create: {
        email: 'sarah.johnson@example.com',
        name: 'Sarah Johnson',
        phone: '+1 (555) 123-4567',
        password: hashedPassword,
        totalDonated: 2500,
        itemsDonated: 15,
      },
    }),
    prisma.user.upsert({
      where: { email: 'michael.chen@example.com' },
      update: {},
      create: {
        email: 'michael.chen@example.com',
        name: 'Michael Chen',
        phone: '+1 (555) 234-5678',
        password: hashedPassword,
        totalDonated: 1800,
        itemsDonated: 12,
      },
    }),
    prisma.user.upsert({
      where: { email: 'emily.rodriguez@example.com' },
      update: {},
      create: {
        email: 'emily.rodriguez@example.com',
        name: 'Emily Rodriguez',
        phone: '+1 (555) 345-6789',
        password: hashedPassword,
        totalDonated: 1500,
        itemsDonated: 8,
      },
    }),
    prisma.user.upsert({
      where: { email: 'david.thompson@example.com' },
      update: {},
      create: {
        email: 'david.thompson@example.com',
        name: 'David Thompson',
        phone: '+1 (555) 456-7890',
        password: hashedPassword,
        totalDonated: 1200,
        itemsDonated: 10,
      },
    }),
    prisma.user.upsert({
      where: { email: 'lisa.wang@example.com' },
      update: {},
      create: {
        email: 'lisa.wang@example.com',
        name: 'Lisa Wang',
        phone: '+1 (555) 567-8901',
        password: hashedPassword,
        totalDonated: 950,
        itemsDonated: 6,
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create sample events
  const events = await Promise.all([
    prisma.event.upsert({
      where: { id: 'event-1' },
      update: {},
      create: {
        id: 'event-1',
        title: 'Foundation Launch',
        description: "We're excited to announce the official launch of The Giving Tree Non-Profit Foundation! Join us in our mission to support Mackenzie Health and make a difference in our community.",
        date: new Date('2025-12-01'),
        type: 'NEWS',
        location: 'Virtual Event',
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-2' },
      update: {},
      create: {
        id: 'event-2',
        title: 'First Community Donation Drive',
        description: 'Join us for our first community-wide donation drive. We\'ll be collecting gently used items at multiple locations across the city. Every item donated helps support Mackenzie Health.',
        date: new Date('2026-01-15'),
        type: 'EVENT',
        location: 'Multiple Locations',
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-3' },
      update: {},
      create: {
        id: 'event-3',
        title: 'Volunteer Orientation Session',
        description: 'Interested in volunteering with The Giving Tree Foundation? Join us for an orientation session to learn about our mission, processes, and how you can get involved.',
        date: new Date('2026-02-01'),
        type: 'EVENT',
        location: 'Community Center',
      },
    }),
  ])

  console.log(`✅ Created ${events.length} events`)

  // Create sample donations for users
  const donations = await Promise.all([
    // Sarah's donations
    prisma.donation.create({
      data: {
        userId: users[0].id,
        amount: 1000,
        type: 'MONETARY',
        status: 'COMPLETED',
        paymentMethod: 'PAYPAL',
      },
    }),
    prisma.donation.create({
      data: {
        userId: users[0].id,
        amount: 1500,
        type: 'MONETARY',
        status: 'COMPLETED',
        paymentMethod: 'E_TRANSFER',
      },
    }),
    // Michael's donations
    prisma.donation.create({
      data: {
        userId: users[1].id,
        amount: 800,
        type: 'MONETARY',
        status: 'COMPLETED',
        paymentMethod: 'CREDIT_CARD',
      },
    }),
    prisma.donation.create({
      data: {
        userId: users[1].id,
        amount: 1000,
        type: 'MONETARY',
        status: 'COMPLETED',
        paymentMethod: 'PAYPAL',
      },
    }),
  ])

  console.log(`✅ Created ${donations.length} donations`)

  // Create sample item donations
  const itemDonations = await Promise.all([
    prisma.itemDonation.create({
      data: {
        userId: users[0].id,
        itemDescription: 'Coffee Table, Bookshelf',
        itemCondition: 'EXCELLENT',
        estimatedValue: 300,
        pickupPreference: 'CAN_DROP_OFF',
        status: 'SOLD',
        images: ['coffee-table.jpg', 'bookshelf.jpg'],
      },
    }),
    prisma.itemDonation.create({
      data: {
        userId: users[1].id,
        itemDescription: 'Laptop, Monitor',
        itemCondition: 'GOOD',
        estimatedValue: 500,
        pickupPreference: 'PICKUP_NEEDED',
        status: 'SOLD',
        images: ['laptop.jpg', 'monitor.jpg'],
      },
    }),
  ])

  console.log(`✅ Created ${itemDonations.length} item donations`)

  // Create sample comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        userId: users[0].id,
        eventId: events[0].id,
        content: 'Congratulations on the launch! Looking forward to supporting this great cause.',
      },
    }),
    prisma.comment.create({
      data: {
        userId: users[1].id,
        eventId: events[0].id,
        content: 'This is exactly what our community needs. Count me in!',
      },
    }),
    prisma.comment.create({
      data: {
        userId: users[2].id,
        eventId: events[0].id,
        content: 'Amazing initiative! Can\'t wait to see the impact you\'ll make.',
      },
    }),
  ])

  console.log(`✅ Created ${comments.length} comments`)

  // Create sample likes
  const likes = await Promise.all([
    prisma.like.create({
      data: {
        userId: users[0].id,
        eventId: events[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: users[1].id,
        eventId: events[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: users[2].id,
        eventId: events[0].id,
      },
    }),
  ])

  console.log(`✅ Created ${likes.length} likes`)

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 