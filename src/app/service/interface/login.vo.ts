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
  type: string
}

interface UserUpdateReq {
  name: string
  photoUrl?: string
}

interface PasswordUpdateReq {
  password: string
}

interface ResetPasswordReq {
  email: string
  password: string
  key: string
}