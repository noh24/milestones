export function sanitizeDocumentName(documentName: string): string {
  let splitDocumentName = documentName.split('/')
  const indexOfUploads = splitDocumentName.indexOf('uploads')
  splitDocumentName.splice(0, indexOfUploads + 1)
  splitDocumentName = splitDocumentName.join('').split('.')
  splitDocumentName = splitDocumentName.join('').split('_')
  return splitDocumentName.slice(0, -1).join('_')
}