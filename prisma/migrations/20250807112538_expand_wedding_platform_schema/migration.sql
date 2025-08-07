-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'COUPLE', 'VENDOR');

-- CreateEnum
CREATE TYPE "public"."VenueType" AS ENUM ('OUTDOOR', 'INTIMATE', 'BEACH_WATERFRONT', 'BARN', 'ESTATE', 'VINEYARD', 'ALL_INCLUSIVE', 'REHEARSAL_DINNER', 'WEDDING_SHOWER');

-- CreateEnum
CREATE TYPE "public"."VendorCategory" AS ENUM ('VENUE', 'PHOTOGRAPHER', 'VIDEOGRAPHER', 'CATERER', 'FLORIST', 'MAKEUP_BEAUTY', 'WEDDING_PLANNER', 'BAND_DJ', 'CAKE_DESSERT', 'BAR_BEVERAGE', 'OFFICIANT');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'COUPLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."couple_profiles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "weddingDate" TIMESTAMP(3),
    "budget" DECIMAL(65,30),
    "guestCount" INTEGER,
    "theme" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couple_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vendor_profiles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "businessName" TEXT NOT NULL,
    "category" "public"."VendorCategory" NOT NULL,
    "description" TEXT,
    "priceRange" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."venues" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "venueType" "public"."VenueType" NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "capacity" INTEGER,
    "priceRange" TEXT,
    "amenities" TEXT[],
    "images" TEXT[],
    "availability" JSONB,
    "vendorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wedding_registries" (
    "id" SERIAL NOT NULL,
    "coupleProfileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wedding_registries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."registry_items" (
    "id" SERIAL NOT NULL,
    "weddingRegistryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30),
    "imageUrl" TEXT,
    "purchased" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registry_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."favorites" (
    "id" SERIAL NOT NULL,
    "coupleProfileId" INTEGER NOT NULL,
    "venueId" INTEGER,
    "vendorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bookings" (
    "id" SERIAL NOT NULL,
    "coupleProfileId" INTEGER NOT NULL,
    "venueId" INTEGER,
    "vendorId" INTEGER,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invitations" (
    "id" SERIAL NOT NULL,
    "coupleProfileId" INTEGER NOT NULL,
    "template" TEXT NOT NULL,
    "customization" JSONB,
    "guestList" JSONB,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "reviewerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inspiration_posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "theme" TEXT,
    "vendors" JSONB,
    "venues" JSONB,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspiration_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "couple_profiles_userId_key" ON "public"."couple_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_userId_key" ON "public"."vendor_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_registries_coupleProfileId_key" ON "public"."wedding_registries"("coupleProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_coupleProfileId_venueId_key" ON "public"."favorites"("coupleProfileId", "venueId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_coupleProfileId_vendorId_key" ON "public"."favorites"("coupleProfileId", "vendorId");

-- AddForeignKey
ALTER TABLE "public"."couple_profiles" ADD CONSTRAINT "couple_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendor_profiles" ADD CONSTRAINT "vendor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."vendor_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wedding_registries" ADD CONSTRAINT "wedding_registries_coupleProfileId_fkey" FOREIGN KEY ("coupleProfileId") REFERENCES "public"."couple_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."registry_items" ADD CONSTRAINT "registry_items_weddingRegistryId_fkey" FOREIGN KEY ("weddingRegistryId") REFERENCES "public"."wedding_registries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_coupleProfileId_fkey" FOREIGN KEY ("coupleProfileId") REFERENCES "public"."couple_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_coupleProfileId_fkey" FOREIGN KEY ("coupleProfileId") REFERENCES "public"."couple_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."vendor_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invitations" ADD CONSTRAINT "invitations_coupleProfileId_fkey" FOREIGN KEY ("coupleProfileId") REFERENCES "public"."couple_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."vendor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
