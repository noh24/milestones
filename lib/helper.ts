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
      'image/jpg',
    ]
    return mimeTypes.includes(lowerCaseType)
  }

  static generateFileExtension(type: string): string {
    const mimeTypes = {
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/pdf': '.pdf',
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/jpg': '.jpg'
    }

    return mimeTypes[type as keyof typeof mimeTypes]
  }

  static generateUploadPath = (): string => {
    const randomId = crypto.randomUUID()
    return path.join(__dirname, '..', '..', '..', '..', '..', 'uploads', randomId)
  }
}