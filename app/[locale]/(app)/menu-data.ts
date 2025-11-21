export type MenuItem = {
  id: string
  title: string
  description: string
  priceTon: number
  imageUrl?: string
  category: string
  ingredients?: string[]
  discount?: number
}

export const SAMPLE_MENU: MenuItem[] = [
  {
    id: "latte",
    title: "Caffè Latte",
    description: "Rich espresso with steamed milk",
    priceTon: 0.85,
    imageUrl: "/caffe-latte.jpg",
    category: "Coffee",
    ingredients: ["Espresso", "Steamed Milk", "Milk Foam"],
  },
  {
    id: "americano",
    title: "Americano",
    description: "Smooth espresso diluted with hot water",
    priceTon: 0.65,
    imageUrl: "/americano-coffee.png",
    category: "Coffee",
    ingredients: ["Espresso", "Hot Water"],
    discount: 10,
  },
  {
    id: "croissant",
    title: "Butter Croissant",
    description: "Flaky, buttery pastry",
    priceTon: 0.45,
    imageUrl: "/butter-croissant.png",
    category: "Bakery",
    ingredients: ["Wheat Flour", "Butter", "Yeast", "Sugar"],
  },
  {
    id: "matcha",
    title: "Matcha Latte",
    description: "Ceremonial matcha with milk",
    priceTon: 0.9,
    imageUrl: "/matcha-latte.png",
    category: "Tea",
    ingredients: ["Matcha Powder", "Steamed Milk", "Honey"],
    discount: 15,
  },
  {
    id: "espresso",
    title: "Espresso",
    description: "Pure, strong Italian coffee",
    priceTon: 0.55,
    imageUrl: "/espresso-shot.jpg",
    category: "Coffee",
    ingredients: ["Arabica Coffee Beans"],
  },
  {
    id: "chai",
    title: "Chai Latte",
    description: "Spiced tea with steamed milk",
    priceTon: 0.75,
    imageUrl: "/chai-latte.png",
    category: "Tea",
    ingredients: ["Black Tea", "Cinnamon", "Cardamom", "Ginger", "Steamed Milk"],
  },
]
