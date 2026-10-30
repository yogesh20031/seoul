-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "admissionEn" TEXT,
ADD COLUMN     "admissionKo" TEXT,
ADD COLUMN     "bestTimeEn" TEXT,
ADD COLUMN     "bestTimeKo" TEXT,
ADD COLUMN     "highlightsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "highlightsKo" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tipsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tipsKo" TEXT[] DEFAULT ARRAY[]::TEXT[];
