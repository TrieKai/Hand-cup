interface NearbySearchReq {
  latitude: number
  longitude: number
  distance: number
}

interface PlaceDetailReq {
  placeId: string
}

interface MyMap {
  favorites: MyMapContent[]
  visiteds: MyMapContent[]
}

interface MyMapContent {
  latitude: number
  longitude: number
  name: string
  image: string
  rating: number
  ratings_total: number
  views: number
}