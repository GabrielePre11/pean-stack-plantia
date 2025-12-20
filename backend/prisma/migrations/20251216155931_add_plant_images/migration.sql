/*
  Warnings:

  - Added the required column `image` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plant" ADD COLUMN     "additionalImages" TEXT[],
ADD COLUMN     "image" TEXT NOT NULL;
