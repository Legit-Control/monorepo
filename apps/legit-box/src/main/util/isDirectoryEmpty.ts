import { promises as fs } from 'fs'

export const isDirectoryEmpty = async (dir: string): Promise<boolean> => {
  try {
    const files = await fs.readdir(dir)
    return files.length === 0
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // console.error(`Error reading directory: ${error.message}`)
    return false
  }
}
