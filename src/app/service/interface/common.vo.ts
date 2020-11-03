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
    lockScreen: boolean
    userData: any
    loginComponentRef: any
    profileComponentRef: any
    reAuthComponentRef: any
    forgotPasswordComponentRef: any
    lockScreenComponentRef: any
}

interface htmlSharedData {
    searchInputRef: any
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
interface ReturnStatus {
    returnStatus?: string
    msg?: any
    error?: any
}

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