import path from 'path'
import crypto from 'crypto'
import { writeFile } from 'fs/promises'
import fs from 'fs'

export const deleteMilestoneDocumentAsync = async (absoluteDocumentPath: string): Promise<void> => {
  try {
    await fs.promises.access(absoluteDocumentPath, fs.constants.F_OK)

    await fs.promises.unlink(absoluteDocumentPath)

  } catch (err) {
    console.log('deleteMilestoneDocumentAsync Error: ', err)

    throw new Error(String(err))
  }
}

export const parseFormData = (formData: FormData) => ({
  title: formData.get('title') as string,
  content: formData.get('content') as string,
  type: formData.get('type') as string,
  date: new Date(formData.get('date') as string).toISOString(),
  document: formData.get('document') as File | string
})

export const uploadDocumentHandler = async (document: File): Promise<string> => {
  if (!validateDocumentType(document.type)) {
    throw new Error('Document type is not acceptable MIME type.')
  }

  if (!validateDocumentSize(document.size)) {
    throw new Error(`File is too large: ${convertByteToMb(document.size)} MB. Maximum file size is 5 MB.`)
  }

  const arrayBuffer = await document.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const uploadsDirectoryPath = generateUploadsDirectoryPath()
  ensureUploadsDirectoryExistsAsync(uploadsDirectoryPath)
  const documentPath = path.join(uploadsDirectoryPath, generateRandomFileName(document))

  await writeFile(documentPath, buffer)
  return documentPath
}

const validateDocumentType = (type: string): boolean => {
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

const validateDocumentSize = (documentSize: number): boolean => {
  return documentSize <= 5 * 1024 * 1024 //max 5mb * 1024 kilobyte in mb * 1024 byte in kilobyte
}
const convertByteToMb = (documentSize: number): string => {
  return (documentSize / 1024 / 1024).toFixed(2)
}

const generateUploadsDirectoryPath = (): string => {
  return path.join(__dirname, '..', '..', '..', '..', '..', 'uploads')
}

// if /uploads directory doesn't exist or is not a directory, create it
const ensureUploadsDirectoryExistsAsync = async (uploadPath: string): Promise<void> => {
  try {
    await fs.promises.mkdir(uploadPath, { recursive: true })

  } catch (err) {
    console.log('Ensure Uploads Directory Exists Error:', err)

    throw new Error(String(err))
  }
}

const generateRandomFileName = (document: File): string => {
  const mimeTypes = {
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/jpg': 'jpg'
  }

  const documentName = document.name.split('.').slice(0, -1).join('')

  return `${documentName}_${crypto.randomUUID()}.${mimeTypes[document.type as keyof typeof mimeTypes]}`
}

