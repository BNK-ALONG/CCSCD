// import { login, logout, getUserInfo } from '@/api/user'
// import { setToken, getToken } from '@/libs/util'

import {
  getClassInfo,
  courseLogin
} from '@/api/user'
import {
  forClassTime
} from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    access: '',
    hasGetInfo: false,
    className: '这里是课堂名'

  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId(state, id) {
      state.userId = id
    },

    //用户名
    setUserName(state, name) {
      state.userName = name
    },

    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    },
    //课堂名
    setClassName(state, className) {
      state.className = className
    },


  },
  actions: {

    //获取课堂登入接口的课堂名，赋给state的className，最后返回后台传过来的message信息
    getClassName({
      commit
    }, {
      course_id
    }) {
      return new Promise((resolve, reject) => {
        courseLogin({
          course_id
        }).then(res => {
          const message = res.message
          const status = res.status
          const className = res.course_name.substring(0, 1).toUpperCase() + res.course_name.substring(1)
          if (status === 200) {
            commit('setClassName', className)
            resolve(message)
          } else {
            reject(message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登录
    handleLogin({
      commit
    }, {
      userName,
      password
    }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          const data = res.data
          commit('setToken', data.token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },

    //登陆之后获取课堂列表信息
    getClassInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getClassInfo().then(res => {
          if (res) {
            // resolve(res.get_courses)
            let courseList = res.get_courses
            var cards = []
            for (var index in courseList) {
              var classId = courseList[index].course_id
              var className = courseList[index].course_name
              var classIntro = courseList[index].brief
              var classTime = new Array()
              if (courseList[index].start_time === '') {
                classTime = ['00', '壹月']
              } else {
                classTime = forClassTime(courseList[index].start_time)
              }
              cards.push({
                classId: classId,
                className: className,
                classIntro: classIntro,
                classYear: classTime[0],
                classMonth: classTime[1]
              })
            }
            resolve(cards)
          } else {
            reject(new Error('错误'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data
            commit('setAvator', data.avator)
            commit('setUserName', data.name)
            commit('setUserId', data.user_id)
            commit('setAccess', data.access)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
