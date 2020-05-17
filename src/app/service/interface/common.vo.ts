interface Coordinate {
    latitude: number | null
    longitude: number | null
}

interface InfoWindowData {
    position: {
        latitude: number
        longitude: number
    };
    name: string
    img: string
    rating: number
    ratingNum: number
    openNow?: boolean
}

interface RespData {
    header: {
        status: string
    }
    body: any
}

interface Menu {
    name: string
    icon: string
}

interface UtilitiesMenu {
    name: string
    icon: string
}