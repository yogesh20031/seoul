-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TRAVELLER', 'GUIDE');

-- CreateEnum
CREATE TYPE "PlaceCategory" AS ENUM ('ATTRACTION', 'RESTAURANT', 'HOTEL');

-- CreateEnum
CREATE TYPE "TransportKind" AS ENUM ('SUBWAY', 'BUS', 'TAXI', 'AIRPORT', 'TMONEY', 'APP');

-- CreateEnum
CREATE TYPE "TourStatus" AS ENUM ('DRAFT', 'OPEN', 'FULL', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "SoloStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'PAID', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TravelMode" AS ENUM ('WALK', 'SUBWAY');

-- CreateEnum
CREATE TYPE "EarningStatus" AS ENUM ('PENDING', 'AVAILABLE', 'PAID_OUT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "country" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideProfile" (
    "userId" TEXT NOT NULL,
    "headline" TEXT NOT NULL DEFAULT '',
    "languages" TEXT[],
    "specialties" TEXT[],
    "soloPrice" INTEGER NOT NULL DEFAULT 80000,
    "soloDurationMin" INTEGER NOT NULL DEFAULT 240,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "stripeAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuideProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "PlaceCategory" NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionKo" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "tags" TEXT[],
    "priceLevel" INTEGER,
    "openHours" TEXT,
    "suggestedMinutes" INTEGER NOT NULL DEFAULT 60,
    "nearestStation" TEXT,
    "bookingUrl" TEXT,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameKo" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionKo" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "spiceLevel" INTEGER NOT NULL DEFAULT 0,
    "priceFrom" INTEGER NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportGuide" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" "TransportKind" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "titleEn" TEXT NOT NULL,
    "titleKo" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "summaryKo" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "bodyKo" TEXT NOT NULL,

    CONSTRAINT "TransportGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "meetingName" TEXT NOT NULL,
    "meetingLat" DOUBLE PRECISION NOT NULL,
    "meetingLng" DOUBLE PRECISION NOT NULL,
    "capacity" INTEGER NOT NULL,
    "pricePerPerson" INTEGER NOT NULL,
    "status" "TourStatus" NOT NULL DEFAULT 'OPEN',
    "coverImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourStop" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "TourStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "travellerId" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "holdExpiresAt" TIMESTAMP(3),
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoloRequest" (
    "id" TEXT NOT NULL,
    "travellerId" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "amount" INTEGER NOT NULL,
    "status" "SoloStatus" NOT NULL DEFAULT 'PENDING',
    "meetingName" TEXT,
    "meetingLat" DOUBLE PRECISION,
    "meetingLng" DOUBLE PRECISION,
    "stripeSessionId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SoloRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "bookingId" TEXT,
    "soloRequestId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Itinerary" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT,
    "shareToken" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT,
    "startTime" TEXT NOT NULL,
    "startLat" DOUBLE PRECISION,
    "startLng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItineraryStop" (
    "id" TEXT NOT NULL,
    "itineraryId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "arriveAt" TEXT NOT NULL,
    "leaveAt" TEXT NOT NULL,
    "travelMin" INTEGER NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "mode" "TravelMode",

    CONSTRAINT "ItineraryStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Earning" (
    "id" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "bookingId" TEXT,
    "soloRequestId" TEXT,
    "gross" INTEGER NOT NULL,
    "platformFee" INTEGER NOT NULL,
    "net" INTEGER NOT NULL,
    "status" "EarningStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Earning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DishToPlace" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DishToPlace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "GuideProfile_ratingAvg_idx" ON "GuideProfile"("ratingAvg");

-- CreateIndex
CREATE UNIQUE INDEX "Place_slug_key" ON "Place"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Place_externalId_key" ON "Place"("externalId");

-- CreateIndex
CREATE INDEX "Place_category_district_idx" ON "Place"("category", "district");

-- CreateIndex
CREATE UNIQUE INDEX "Dish_slug_key" ON "Dish"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TransportGuide_slug_key" ON "TransportGuide"("slug");

-- CreateIndex
CREATE INDEX "Tour_status_startsAt_idx" ON "Tour"("status", "startsAt");

-- CreateIndex
CREATE INDEX "Tour_guideId_startsAt_idx" ON "Tour"("guideId", "startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "TourStop_tourId_order_key" ON "TourStop"("tourId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_stripeSessionId_key" ON "Booking"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_tourId_travellerId_key" ON "Booking"("tourId", "travellerId");

-- CreateIndex
CREATE UNIQUE INDEX "SoloRequest_stripeSessionId_key" ON "SoloRequest"("stripeSessionId");

-- CreateIndex
CREATE INDEX "SoloRequest_guideId_status_idx" ON "SoloRequest"("guideId", "status");

-- CreateIndex
CREATE INDEX "SoloRequest_travellerId_idx" ON "SoloRequest"("travellerId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_soloRequestId_key" ON "Review"("soloRequestId");

-- CreateIndex
CREATE INDEX "Review_guideId_createdAt_idx" ON "Review"("guideId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Itinerary_shareToken_key" ON "Itinerary"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "ItineraryStop_itineraryId_order_key" ON "ItineraryStop"("itineraryId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Earning_bookingId_key" ON "Earning"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Earning_soloRequestId_key" ON "Earning"("soloRequestId");

-- CreateIndex
CREATE INDEX "Earning_guideId_createdAt_idx" ON "Earning"("guideId", "createdAt");

-- CreateIndex
CREATE INDEX "_DishToPlace_B_index" ON "_DishToPlace"("B");

-- AddForeignKey
ALTER TABLE "GuideProfile" ADD CONSTRAINT "GuideProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourStop" ADD CONSTRAINT "TourStop_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourStop" ADD CONSTRAINT "TourStop_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloRequest" ADD CONSTRAINT "SoloRequest_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloRequest" ADD CONSTRAINT "SoloRequest_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_soloRequestId_fkey" FOREIGN KEY ("soloRequestId") REFERENCES "SoloRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryStop" ADD CONSTRAINT "ItineraryStop_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryStop" ADD CONSTRAINT "ItineraryStop_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Earning" ADD CONSTRAINT "Earning_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "GuideProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Earning" ADD CONSTRAINT "Earning_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Earning" ADD CONSTRAINT "Earning_soloRequestId_fkey" FOREIGN KEY ("soloRequestId") REFERENCES "SoloRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishToPlace" ADD CONSTRAINT "_DishToPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishToPlace" ADD CONSTRAINT "_DishToPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
