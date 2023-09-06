export default class Helper {

  static sanitizeErrorMessage(error: string): string {
    if (error.length <= 'error:'.length) return error
    return error.split(' ').filter((e) => e.toLowerCase() !== 'error:').join(' ')
  }
}