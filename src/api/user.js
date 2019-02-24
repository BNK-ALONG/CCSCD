import axios from '@/libs/api.request'

export const getUserInfo = ({
  userId
}) => {
  return axios.request({
    url: '/getUserInfo',
    method: 'post',
    data: {
      userId
    }
  })
}
// 登录
export const login = ({
  userName,
  password
}) => {
  return axios.request({
    url: '/users/login',
    method: 'post',
    responseType: 'json',
    data: {
      userName,
      password
    }
  })
}

// 自动检验token方法
// export const authorization = () => {
//   return axios.request({
//     url: '/users/authorization',
//     method: 'get'
//   })
// }

// 注册接口
export const register = ({
  userName,
  password,
  name,
  workplace,
  number,
  email

}) => {
  return axios.request({
    url: '/users/register',
    method: 'post',
    responseType: 'json',
    data: {
      userName,
      password,
      name,
      workplace,
      number,
      email
    }
  })
}

export const classAdd = ({
  get_course_name,
  start_time,
  brief
}) => {
  return axios.request({
    url: '/sign/course_register',
    method: 'post',
    responseType: 'json',
    data: {
      get_course_name,
      start_time,
      brief
    }
  })
}

export const getClassInfo = () => {
  return axios.request({
    url: '/sign/course_list',
    method: 'post',
    responseType: 'json',
    data: {
      // get_course_name
    }
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
