import { CareLevel, WaterType, LightType } from "@/generated/prisma/enums";

export interface PlantBody {
  name: string;
  description: string;
  image: string;
  additionalImages?: string[];
  categoryId: number;
  careLevel: CareLevel;
  light: LightType;
  water: WaterType;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface PlantQuery {
  categoryId: number;
  sort: "newest" | "oldest" | "priceAsc" | "priceDesc";
  careLevel: CareLevel;
  light: LightType;
  water: WaterType;
  page: number;
  limit: number;
  search: string;
}
