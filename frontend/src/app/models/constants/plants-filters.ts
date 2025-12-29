export const PLANTS_FILTERS = [
  {
    name: 'Category',
    value: 'category',
    options: [
      { name: 'Monstera', value: 'monstera' },
      { name: 'Philodendron', value: 'philodendron' },
      { name: 'Ficus', value: 'ficus' },
      { name: 'Succulents', value: 'succulents' },
      { name: 'Calathea', value: 'calathea' },
      { name: 'Cactus', value: 'cactus' },
      { name: 'Palm', value: 'palm' },
      { name: 'Fern', value: 'fern' },
      { name: 'Bonsai', value: 'bonsai' },
      { name: 'Alocasia', value: 'alocasia' },
      { name: 'Anthurium', value: 'anthurium' },
      { name: 'Begonia', value: 'begonia' },
      { name: 'Orchid', value: 'orchid' },
    ],
  },

  {
    name: 'Sort by',
    value: 'sort',
    options: [
      { name: 'Newest', value: 'newest' },
      { name: 'Oldest', value: 'oldest' },
      { name: 'Price: Low to High', value: 'priceAsc' },
      { name: 'Price: High to Low', value: 'priceDesc' },
    ],
  },

  {
    name: 'Level of Care',
    value: 'careLevel',
    options: [
      { name: 'Easy', value: 'EASY' },
      { name: 'Medium', value: 'MEDIUM' },
      { name: 'Hard', value: 'HARD' },
    ],
  },

  {
    name: 'Type of Light',
    value: 'light',
    options: [
      { name: 'Low', value: 'LOW' },
      { name: 'Indirect', value: 'INDIRECT' },
      { name: 'Direct', value: 'DIRECT' },
    ],
  },

  {
    name: 'Type of Water',
    value: 'water',
    options: [
      { name: 'Low', value: 'LOW' },
      { name: 'Medium', value: 'MEDIUM' },
      { name: 'High', value: 'HIGH' },
    ],
  },
];
