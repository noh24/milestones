import path from 'path'
import crypto from 'crypto'
import { writeFile } from 'fs/promises'

export const parseFormData = (formData: FormData) => ({
  title: formData.get('title') as string,
  content: formData.get('content') as string,
  type: formData.get('type') as string,
  date: new Date(formData.get('date') as string).toISOString(),
  document: formData.get('document') as Blob | null
})

export const uploadDocumentHandler = async (document: Blob): Promise<string> => {
  if (!validateDocumentType(document.type)) {
    throw new Error('Document type is not acceptable MIME type.')
  }

  if (!validateDocumentSize(document.size)) {
    throw new Error('File is too large. Maximum file size is 5MB.')
  }

  const arrayBuffer = await document.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const documentPath = generateUploadPath() + generateFileExtension(document.type)
  await writeFile(documentPath, buffer)

  return documentPath
}

export const validateDocumentType = (type: string): boolean => {
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

export const validateDocumentSize = (documentSize: number): boolean => {
  return documentSize <= 5 * 1024 * 1024 //max 5mb * 1024 kilobyte in mb * 1024 byte in kilobyte
}

export const generateFileExtension = (type: string): string => {
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

export const generateUploadPath = (): string => {
  const randomId = crypto.randomUUID()
  return path.join(__dirname, '..', '..', '..', '..', '..', 'uploads', randomId)
}