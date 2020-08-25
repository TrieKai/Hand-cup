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
    title: string
    router: string
    icon: string
}

interface UtilitiesMenu {
    name: string
    icon: string
}

interface Message {
    type: string
    title: string
    content: string
    time?: number
    sticky?: boolean
}

interface commonSharedData {
    onloading: boolean
    userData: any
    loginComponentRef: any
    profileComponentRef: any
}

interface firebaseProfile {
    displayName?: string;
    photoURL?: string;
}