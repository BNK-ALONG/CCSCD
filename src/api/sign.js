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

// 下载全部的签到记录表
export const allSignRecord = () => {
  return axios.request({
    url: '/sign/all_records_export',
    method: 'post',
    responseType: 'blob'
  })
}

// 下载最新的签到记录表
export const newSignRecord = () => {
  return axios.request({
    url: '/sign/records_export',
    method: 'post',
    responseType: 'blob'
  })
}

// 修改签到状态
export const updateSignRecord = ({
  stuid,
  status
}) => {
  return axios.request({
    url: '/sign/update_record',
    method: 'post',
    data: {
      stuid,
      status
    }
  })
}

// 获取当前的签到情况
export const nowSignRecord = () => {
  return axios.request({
    url: '/sign/located_records',
    method: 'post'
  })
}

// 获取全部签到信息
export const allLocatedRecord = () => {
  return axios.request({
    url: '/sign/all_located_records',
    method: 'post'
  })
}

// 获取课程的六大数字信息
export const classNumber = () => {
  return axios.request({
    url: '/sign/course_details',
    method: 'post'
  })
}
