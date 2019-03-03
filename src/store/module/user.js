import {
  login,
  logout
} from '@/api/user'
import {
  setToken,
  getToken
} from '@/libs/util'

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
    // 女生头像：https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4084691320,1062400384&fm=26&gp=0.jpg
    avatorImgPath: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3445867392,386919342&fm=26&gp=0.jpg',
    access: '',
    hasGetInfo: true,
    token: getToken()
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


  },
  actions: {


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
          if (res.status === 200) {
            commit('setToken', userName)
            resolve(res.message)
          } else {
            reject(res.message)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({
      commit
    }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          if (res.status === 200) {
            commit('setToken', '')
            commit('setAccess', [])
            resolve(res.message)
          } else {
            reject(res.message)
          }
        }).catch(err => {
          reject(err)
        })
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
