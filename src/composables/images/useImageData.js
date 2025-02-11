import { apiService } from '@/services/apiService'

export async function useGetImageData() {
  try {
    const res = await apiService.fetchImages()

    return res.data
  } catch (err) {
    return []
  }
}

export async function useGetImageById(id) {
  try {
    const res = await apiService.getImage(id)

    return res.data
  } catch (err) {
    return []
  }
}

export async function useGetImageFolder(path = ""){
  try {
    const res = await apiService.fetchFolders(path)

    return res.data
  } catch (err) {
    return []
  }
}

export function useGetImagePath(image) {
  return `${apiService.getBasePath()}/images${image}`
}
