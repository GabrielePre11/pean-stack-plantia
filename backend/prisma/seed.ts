import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../src/lib/prisma";
import slugify from "slugify";
import axios from "axios";
import Decimal from "decimal.js";

import { CATEGORIES } from "../src/constants/categories";
import { buildPlantDescription } from "../src/utils/plantDescription";

async function seedCategories() {
  const existingCategories = await prisma.category.findMany();

  if (existingCategories.length === 0) {
    await prisma.category.createMany({
      data: CATEGORIES.map((category) => ({
        name: category.name,
        slug: slugify(category.name, { lower: true, strict: true }),
      })),
    });
  }
  console.log("Categories seeded successfully. ✅");
}

async function seedPlants() {
  const categories = await prisma.category.findMany();

  for (const category of categories) {
    console.info(`Seeding ${category.name}...`);

    const resp = await axios.get("https://perenual.com/api/species-list", {
      params: {
        key: process.env.PERENUAL_API_KEY,
        q: category.name,
        per_page: 100,
      },
    });

    for (const plant of resp.data.data) {
      const imageUrl = plant.default_image?.original_url;

      if (!plant.common_name || !imageUrl || imageUrl.includes("upgrade")) {
        continue;
      }

      const slug = slugify(plant.common_name, { lower: true, strict: true });

      await prisma.plant.upsert({
        where: { slug },
        update: {},
        create: {
          //================= Name, Slug, Description ================//
          name: plant.common_name,
          slug,
          description: buildPlantDescription(plant),

          //================= Image & Additional Images ================//
          image: imageUrl,
          additionalImages: [],

          //================= CategoryId [Foreign Key] ================//
          categoryId: category.id,

          //================= CareLevel, Light, Water ================//
          careLevel:
            plant.maintenance === "Low"
              ? "EASY"
              : plant.maintenance === "Medium"
              ? "MEDIUM"
              : plant.maintenance === "High"
              ? "HARD"
              : "EASY",

          light:
            Array.isArray(plant.sunlight) &&
            plant.sunlight.some((s: string) =>
              s.toLowerCase().includes("direct")
            )
              ? "DIRECT"
              : "INDIRECT",

          water:
            plant.watering === "Frequent"
              ? "HIGH"
              : plant.watering === "Minimum"
              ? "LOW"
              : "MEDIUM",

          //================= Price, Stock, IsActive ================//
          price: new Decimal(Math.floor(Math.random() * 30) + 10),
          stock: Math.floor(Math.random() * 20) + 5,
          isActive: true,
        },
      });
    }
  }
  console.log("✅ Plants seeded successfully.");
}

async function main() {
  // @ Categories must be seeded first because they are required for plants (Foreign Key),
  // @ that's why in this case it's not possible to use Promise.all.
  await seedCategories();
  await seedPlants();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
