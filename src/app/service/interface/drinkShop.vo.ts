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
}

interface drinkShopDetail {
    place_id: string
    formatted_address: string
    formatted_phone_number: string
    website: string
    price_level: number
    photos: {
        width: number
        height: number
        photo_reference: string
        html_attributions: string[]
    }[]
    reviews: {
        profile_photo_url: string
        author_name: string
        rating: number
        text: string
        time: number
    }[]
}

interface drinkShopSharedData {
    onloading: boolean
    showMap: boolean
    drinkShopResults: drinkShopResults[]
}
