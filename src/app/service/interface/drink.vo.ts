interface drinksData {
  name: string
  image: string
  subDrinks?: {
    name: string
    image?: string
  }[]
}