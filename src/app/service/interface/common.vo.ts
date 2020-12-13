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
  views?: number
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

interface JwtPayload {
  authorized: boolean
  exp: number
  user_id: string
}

interface Menu {
  title: string
  router: string
  icon: string
  active: boolean
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

interface TourData {
  step: number
  target: Element
  title: string
  content: string
  timeout: number
  position?: {
    top?: number
    right?: number
    left?: number
    bottom?: number
  }
}

interface commonSharedData {
  userData: any
  drinkShopResults: drinkShopResults[]
}

interface commonSharedComponent {
  loginComponentRef: any
  profileComponentRef: any
  reAuthComponentRef: any
  forgotPasswordComponentRef: any
  lockScreenComponentRef: any
  reviewComponentRef: any
  confirmComponentRef: any
  tourComponentRef: any
}

interface htmlSharedData {
  searchInputRef: any
}

interface SharedStatus {
  onloading: boolean
  lockScreen: boolean
  showMap: boolean
  isConfirm: boolean
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