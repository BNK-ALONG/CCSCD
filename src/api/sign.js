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

// 课堂登陆
export const courseLogin = ({
  course_id
}) => {
  return axios.request({
    url: '/sign/course_login',
    method: 'post',
    responseType: 'json',
    data: {
      course_id
    }
  })
}

// 获取二维码图片的路径
export const getQRImg = () => {
  return axios.request({
    url: '/sign/show_qrcode',
    method: 'post',
  })
}

// 获取全部的签到记录表
export const allSignRecord = () => {
  return axios.request({
    url: '/sign/all_records_export',
    method: 'post',
    responseType: 'blob'
  })
}

// 获取最新的签到记录表
export const newSignRecord = () => {
  return axios.request({
    url: '/sign/records_export',
    method: 'post',
    responseType: 'blob'
  })
}


export const nowSignRecord = () => {
  return axios.request({
    url: '/sign/located_records',
    method: 'post'
  })
}
