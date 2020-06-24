interface drinkShopResults {
    place_id: string
    latitude: number
    longitude: number
    name: string
    image_url: string
    rating: number
    ratings_total: number
    distanceGap?: number
}

interface drinkShopSharedData {
    showMap: boolean
    drinkShopResults: drinkShopResults[]
}