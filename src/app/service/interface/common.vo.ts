interface env {
    production: boolean
    firebase: object
    url: string
    photoAPIKey: string
}

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
    body: {
        data: any
    }
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
    userData: any
    drinkShopResults: drinkShopResults[]
    loginComponentRef: any
    profileComponentRef: any
    reAuthComponentRef: any
    forgotPasswordComponentRef: any
    lockScreenComponentRef: any
    reviewComponentRef: any
}

interface htmlSharedData {
    searchInputRef: any
}

interface SharedStatus {
    onloading: boolean
    lockScreen: boolean
    showMap: boolean
}

interface firebaseProfile {
    displayName?: string
    photoURL?: string
}

interface userPreferData {
    id: number
    place_id: string
    user_id: string
    create_time: string
    update_time: string
}

// normal
interface DeviceType {
    mobile: boolean
    ios: boolean
    android: boolean
    chrome: boolean
    safari: boolean
    firefox: boolean
    ie: boolean
    edge: boolean
    webView: boolean
}