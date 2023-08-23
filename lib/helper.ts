export const validateType = (type: string): boolean => {
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
