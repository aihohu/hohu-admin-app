/** 后端登录和 refresh rotation 返回的 access/refresh token 对。 */
export interface IAuthLoginRes {
  token: string
  refreshToken: string
}

/**
 * 用户信息
 */
export interface IUserInfoRes {
  userId: string
  userName: string
  userAvatar: string
  roles: string[]
  buttons: string[]
}

/**
 * 获取验证码
 */
export interface ICaptcha {
  captchaEnabled: boolean
  uuid: string
  image: string
}
/**
 * 上传成功的信息
 */
export interface IUploadSuccessInfo {
  fileId: string
  originalName: string
  fileName: string
  storagePath: string
  fileHash: string
  fileType: string
  fileBusinessType: string
  fileSize: number
}
/**
 * 更新用户信息
 */
export interface IUpdateInfo {
  id: number
  name: string
  sex: string
}
/**
 * 更新用户信息
 */
export interface IUpdatePassword {
  id: number
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
