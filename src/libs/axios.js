import axios from 'axios'
import store from '@/store'
import qs from 'qs'

// import { Spin } from 'iview'

//收集错误信息，错误日志
// const addErrorLog = errorInfo => {
//   const {
//     statusText,
//     status,
//     request: {
//       responseURL
//     }
//   } = errorInfo
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   }
//   if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
// }

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true

      if (config.method == 'post') {
        config.data = qs.stringify(config.data) // 防止post请求参数无法传到后台
      }
      // 对所有的请求方法进行以key：val的形式传参
      // config.data = qs.stringify(config.data)
      // config.headers['Authorization'] = getToken()
      // 响应的所有请求拦截设置
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      // const { data, status } = res
      // return { data, status }
      const {
        data
      } = res
      return data
    }, error => {
      this.destroy(url)
      // 把错误原因填写到错误日志里
      // addErrorLog(error.response)
      return Promise.reject(error)
    })
  }
  request(options) {
    // 创建一个实例
    const instance = axios.create()
    // 配置一些设置
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
