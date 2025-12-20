const INTRO_VARIANTS = [
  "is a popular houseplant that will bring life to any space",
  "is a stunning indoor plant, perfect for adding a tropical touch",
  "is well known for its beautiful foliage and easy care",
];

const ORIGIN_VARIANTS = [
  "native to tropical forests",
  "originally from lush islands",
  "from a warm, humid environment",
  "thriving naturally in rainforest regions",
];

const LEAF_DESC_VARIANTS = [
  "with its vibrant green leaves that catch the light beautifully",
  "featuring elegant, feathery foliage that stands out in any room",
  "showcasing large, patterned leaves that make a statement",
];

function getWaterText(watering?: string): string {
  if (!watering) return "moderate watering";

  const value = watering.toLowerCase();

  if (value.includes("frequent")) return "regular watering";
  if (value.includes("minimum")) return "minimal watering";

  return "moderate watering";
}

function getLightText(sunlight?: string[]): string {
  if (!Array.isArray(sunlight)) return "indirect light";

  if (sunlight.some((s) => s.toLowerCase().includes("direct"))) {
    return "bright direct light";
  }

  return "bright indirect light";
}

export function buildPlantDescription(plant: any): string {
  const intro =
    INTRO_VARIANTS[Math.floor(Math.random() * INTRO_VARIANTS.length)];
  const origin =
    ORIGIN_VARIANTS[Math.floor(Math.random() * ORIGIN_VARIANTS.length)];
  const leafDesc =
    LEAF_DESC_VARIANTS[Math.floor(Math.random() * LEAF_DESC_VARIANTS.length)];

  const name = plant.common_name;
  const scientific = plant.scientific_name?.[0] ?? "";

  const lightText = getLightText(plant.sunlight);
  const waterText = getWaterText(plant.watering);
  const maintenance = plant.maintenance?.toLowerCase() ?? "easy to care for";

  return `Do you fancy a tropical ambience in your home? Meet ${name} (${scientific}), ${intro}. ${leafDesc}. ${name} is ${origin}, prefers ${lightText}, requires ${waterText}, and is considered ${maintenance}. Add some tropical vibes to your space with this beautiful plant!`;
}
