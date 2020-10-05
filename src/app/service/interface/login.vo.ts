interface LoginReq {
  userId: string
  email: string
  password: string
}

interface SignUpReq {
  userId: string
  name?: string
  email: string
  password: string
}

interface UserUpdateReq {
  name: string
  email: string
  password: string
}