import path from 'path'
import crypto from 'crypto'

export default class Helper {

  static confirmPassword(userData: UserData): boolean {
    return userData.password === userData.confirmPassword
  }

  static validateType(type: string): boolean {
    const lowerCaseType = type.toLowerCase()
    const mimeTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
      'image/jpeg',
      'image/png',
    ]
    return mimeTypes.includes(lowerCaseType)
  }

  static generateUploadPath = (): string => {
    const randomId = crypto.randomUUID()
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    return path.join(__dirname, '..', '..', '..', 'uploads', String(year), String(month), randomId)
  }
}