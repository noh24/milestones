import path from 'path'
import crypto from 'crypto'
import { writeFile } from 'fs/promises'
import fs from 'fs'
import { MilestoneFormData, ParsedMilestoneFormData } from '@/types/types'
import { Milestone } from '@prisma/client'

export async function handleDocumentUpdate(existingMilestone: Milestone, milestoneData: MilestoneFormData): Promise<string> {
  let documentPath: string = ''

  if (existingMilestone.document && existingMilestone.document !== milestoneData.document) {
    documentPath = await handleDocumentUpload(milestoneData.document as File)
    handleDocumentDelete(existingMilestone.document)
  }

  if (!existingMilestone.document && milestoneData.document) {
    documentPath = await handleDocumentUpload(milestoneData.document as File)
  }

  return documentPath
}

export async function handleDocumentDelete(absoluteDocumentPath: string): Promise<void> {
  try {
    await fs.promises.access(absoluteDocumentPath, fs.constants.F_OK)

    await fs.promises.unlink(absoluteDocumentPath)

  } catch (err) {
    console.log('deleteMilestoneDocumentAsync Error: ', err)

    throw new Error(String(err))
  }
}

export function parseFormData(formData: FormData): ParsedMilestoneFormData {
  return {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    type: formData.get('type') as string,
    date: new Date(formData.get('date') as string).toISOString(),
  }
}

export async function handleDocumentUpload(document: File): Promise<string> {
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

function validateDocumentType(type: string): boolean {
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

function validateDocumentSize(documentSize: number): boolean {
  return documentSize <= 5 * 1024 * 1024 //max 5mb * 1024 kilobyte in mb * 1024 byte in kilobyte
}

function convertByteToMb(documentSize: number): string {
  return (documentSize / 1024 / 1024).toFixed(2)
}

function generateUploadsDirectoryPath(): string {
  return path.join(__dirname, '..', '..', '..', '..', '..', 'uploads')
}

// if /uploads directory doesn't exist or is not a directory, create it
async function ensureUploadsDirectoryExistsAsync(uploadPath: string): Promise<void> {
  try {
    await fs.promises.mkdir(uploadPath, { recursive: true })

  } catch (err) {
    console.log('Ensure Uploads Directory Exists Error:', err)

    throw new Error(String(err))
  }
}

function generateRandomFileName(document: File): string {
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

