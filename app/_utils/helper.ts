export default class Helper {
  static sanitizeErrorMessage(error: string): string {
    if (error.length <= 'error:'.length) return error
    return error.split(' ').filter((e) => e.toLowerCase() !== 'error:').join(' ')
  }

  static sanitizeDocumentName(documentName: string): string {
    return 'C://Fake//Path//' + documentName.slice(49).split('_').slice(0, -1).join('_')
  }

  static async revalidatePath({ path }: { path: string }) {
    await fetch(`/api/revalidate?path=${path}&secret=${process.env.NEXT_PUBLIC_SECRET_REVALIDATION_TOKEN}`, {
      method: 'POST'
    })
  }
}