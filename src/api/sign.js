import axios from '@/libs/api.request'
export const issueSign = ({
  lngX,
  latY,
  distance,
  time_interval,
  location
}) => {
  return axios.request({
    url: '/sign/locate',
    method: 'post',
    data: {
      lngX,
      latY,
      distance,
      time_interval,
      location
    }
  })
}

// 快速签到
export const rapidSign = () => {
  return axios.request({
    url: '/sign/quick_locate',
    method: 'post'
  })
}

// 获取二维码图片的路径
export const getQRImg = () => {
  return axios.request({
    url: '/sign/show_qrcode',
    method: 'post',
    responseType: "arraybuffer"
  })
}
