import httpService from './httpService'

const baseApiUrl = '/api/refs'

export const apiService = {
  fetchFolders(id) {
    return httpService.get(`${baseApiUrl}/folders${id}`)
  },
  fetchImages() {
    return httpService.get(`${baseApiUrl}/images`)
  },
  fetchRandomImages(id, numberOfImages) {
    const config = {
      params: {
        num: numberOfImages,
      },
    }
    return httpService.get(`${baseApiUrl}/random-images${id}`, config)
  },
  getImage(id) {
    return httpService.get(`${baseApiUrl}/images${id}`)
  },
  getBasePath() {
    return httpService.baseURL + baseApiUrl
  },
}
