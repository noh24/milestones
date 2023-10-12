import path from 'path'
import crypto from 'crypto'
import { writeFile } from 'fs/promises'
import fs from 'fs'
import { ParsedCreateMilestoneFormData, ParsedEditMilestoneFormData, } from '@/types/types'
import { Milestone } from '@prisma/client'

export async function handleDocumentUpdate(
  existingMilestone: Milestone,
  milestoneData: ParsedEditMilestoneFormData
): Promise<string> {
  // If Existing Milestone has Document Path AND it's not equal to new Milestone documentPath
  // Delete File using Existing Milestone Document Path
  // Upload new Milestone document and return path
  if (existingMilestone.documentPath && existingMilestone.documentPath !== milestoneData.documentPath) {
    handleDocumentDelete(existingMilestone.documentPath)
    return await handleDocumentUpload(milestoneData.document as File)
  }
  // If No Existing Document Path AND new Milestone document present
  // Upload new Milestone document
  if (!existingMilestone.documentPath && milestoneData.document) {
    return await handleDocumentUpload(milestoneData.document as File)
  }

  return ''
}

export async function handleDocumentDelete(absoluteDocumentPath: string): Promise<void> {
  try {
    // Checks Accessibility of File - Resolves to Nothing or Throws Exception
    await fs.promises.access(absoluteDocumentPath, fs.constants.F_OK)
    // Deletes File
    await fs.promises.unlink(absoluteDocumentPath)

  } catch (err) {
    console.log('deleteMilestoneDocumentAsync Error: ', err)
    throw Error(String(err))
  }
}

// Parse Form Data For Creating Milestone
export function parseCreateFormData(formData: FormData): ParsedCreateMilestoneFormData {
  return {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    type: formData.get('type') as string,
    date: new Date(formData.get('date') as string).toISOString(),
  }
}

// Parse Form Data For Editing Milestone
export function parseEditFormData(formData: FormData): ParsedEditMilestoneFormData {
  return {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    type: formData.get('type') as string,
    date: new Date(formData.get('date') as string).toISOString(),
    document: formData.get('document') as unknown as File,
    documentPath: formData.get('documentPath') as string,
    id: formData.get('id') as string
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

