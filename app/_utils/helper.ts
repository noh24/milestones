export default class Helper {
  static sanitizeErrorMessage(error: string): string {
    if (error.length <= 'error:'.length) return error
    return error.split(' ').filter((e) => e.toLowerCase() !== 'error:').join(' ')
  }

  static sanitizeDocumentName(documentName: string): string {
    let splitDocumentName = documentName.split('/')
    const indexOfUploads = splitDocumentName.indexOf('uploads')
    splitDocumentName.splice(0, indexOfUploads + 1)
    splitDocumentName = splitDocumentName.join('').split('.')
    splitDocumentName = splitDocumentName.join('').split('_')
    return splitDocumentName.slice(0, -1).join('_')
  }

  static async revalidatePath({ path }: { path: string }) {
    await fetch(`/api/revalidate?path=${path}&secret=${process.env.NEXT_PUBLIC_SECRET_REVALIDATION_TOKEN}`, {
      method: 'POST'
    })
  }
}