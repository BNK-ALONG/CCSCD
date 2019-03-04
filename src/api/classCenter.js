import axios from '@/libs/api.request'

export const wordCloud = () => {
  return axios.request({
    url: '/class_center/word_cloud',
    method: 'post'
  })
}
