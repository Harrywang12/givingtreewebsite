-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."DonationType" AS ENUM ('MONETARY', 'ITEM');

-- CreateEnum
CREATE TYPE "public"."DonationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('PAYPAL', 'E_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD');

-- CreateEnum
CREATE TYPE "public"."ItemCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "public"."PickupPreference" AS ENUM ('PICKUP_NEEDED', 'CAN_DROP_OFF', 'EITHER_OPTION');

-- CreateEnum
CREATE TYPE "public"."ItemDonationStatus" AS ENUM ('PENDING', 'REVIEWED', 'APPROVED', 'REJECTED', 'PICKED_UP', 'SOLD');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('NEWS', 'EVENT', 'ANNOUNCEMENT');

-- CreateTable
CREATE TABLE "public"."app_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "totalDonated" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "itemsDonated" INTEGER NOT NULL DEFAULT 0,
    "memberSince" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."app_donations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "public"."DonationType" NOT NULL,
    "status" "public"."DonationStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "public"."PaymentMethod",
    "transactionId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."app_item_donations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "itemCondition" "public"."ItemCondition" NOT NULL,
    "estimatedValue" DOUBLE PRECISION,
    "pickupPreference" "public"."PickupPreference" NOT NULL,
    "additionalNotes" TEXT,
    "status" "public"."ItemDonationStatus" NOT NULL DEFAULT 'PENDING',
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_item_donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."app_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "public"."EventType" NOT NULL,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."app_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."app_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."app_newsletters" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_users_email_key" ON "public"."app_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "app_likes_userId_eventId_key" ON "public"."app_likes"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "app_newsletters_email_key" ON "public"."app_newsletters"("email");

-- AddForeignKey
ALTER TABLE "public"."app_donations" ADD CONSTRAINT "app_donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."app_item_donations" ADD CONSTRAINT "app_item_donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."app_events" ADD CONSTRAINT "app_events_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."app_comments" ADD CONSTRAINT "app_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."app_comments" ADD CONSTRAINT "app_comments_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."app_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."app_likes" ADD CONSTRAINT "app_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."app_likes" ADD CONSTRAINT "app_likes_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."app_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
