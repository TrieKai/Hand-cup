interface drinkShopResults {
    place_id: string
    latitude: number
    longitude: number
    name: string
    image_url: string
    rating: number
    ratings_total: number
    views: number
    distanceGap?: number
    website: string
    price_level: number
    reviews: {
        profile_photo_url: string
        author_name: string
        rating: number
        text: string
    }
}

interface drinkShopSharedData {
    onloading: boolean
    showMap: boolean
    drinkShopResults: drinkShopResults[]
}
