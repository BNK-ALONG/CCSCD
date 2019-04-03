import {
  login,
  logout
} from '@/api/user'
import {
  setToken,
  getToken
} from '@/libs/util'
import {
  getAllNotice,
  pastAnswer,
  randomStu,
  startClass,
  endClass,
  noteMessage
} from '@/api/classCenter'
import {
  getClassInfo,
  courseLogin
} from '@/api/user'
import {
  forClassTime
} from '@/libs/util'

export default {
  state: {
    // 女生头像：https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4084691320,1062400384&fm=26&gp=0.jpg
    avatorImgPath: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3445867392,386919342&fm=26&gp=0.jpg',
    access: '',
    hasGetInfo: true,
    token: getToken(),
    draftNoticeList: [],
    pastNoticeList: [],
    answerList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
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
    // 设置草稿箱的公告的列表
    setdraftNoticeList(state, list) {
      state.draftNoticeList = list
    },
    // 设置历史公告的列表
    setPastNoticeList(state, list) {
      state.pastNoticeList = list
    },
    // 设置历史答疑的列表
    setAnswerList(state, list) {
      state.answerList = list
    },
    updateMessageContentStore(state, {
      msg_id,
      content
    }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg(state, {
      from,
      to,
      msg_id
    }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    draftNoticeCount: state => state.draftNoticeList.length,
    pastNoticeCount: state => state.pastNoticeList.length,
    answerCount: state => state.answerList.length
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
            let courseList = res.get_courses
            let cards = []
            for (var index in courseList) {
              let classId = courseList[index].course_id
              let className = courseList[index].course_name
              let classIntro = courseList[index].brief
              let title = courseList[index].title
              console.log('type:', typeof (Object.keys(title).length))
              console.log(Object.keys(title).length)
              console.log(Boolean(Object.keys(title).length))
              let classTime = new Array()
              if (courseList[index].start_time === '') {
                classTime = ['00', '壹月']
              } else {
                classTime = forClassTime(courseList[index].start_time)
              }
              cards.push({
                classId: classId,
                className: className,
                classIntro: classIntro,
                classTime: courseList[index].start_time,
                classYear: classTime[0],
                classMonth: classTime[1],
                title: title
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
    },

    // 获取所有的公告和历史答疑
    getAllNotice({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getAllNotice().then(res => {
          commit('setdraftNoticeList', res.draft_notices.map(_ => {
            _.loading = false
            _.sendLoading = false
            return _
          }))
          commit('setPastNoticeList', res.past_notices.map(_ => {
            _.loading = false
            return _
          }))
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    getPastAnswer({
      commit
    }) {
      return new Promise((resolve, reject) => {
        pastAnswer().then(res => {
          commit('setAnswerList', res.past_answers.map(_ => {
            _.loading = false
            return _
          }))
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 随机点人
    getRandomStu({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        randomStu().then(res => {
          if (res.status === 200) {
            resolve(res)
          } else {
            reject(new Error('获取随机学生失败！'))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 上课
    makeStart({
      commit
    }) {
      return new Promise((resolve, reject) => {
        startClass().then(res => {
          if (res.status === 200) {
            resolve("开始上课")
          } else {
            reject(new Error('上课开启失败！'))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 下课
    makeEnd() {
      return new Promise((resolve, reject) => {
        endClass().then(res => {
          if (res.status === 200) {
            resolve('结束本节课')
          } else {
            reject(new Error('本节课结束失败'))
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 进度提示
    noteMessage({
      commit
    }) {
      return new Promise((resolve, reject) => {
        noteMessage().then(res => {
          if (res.status === 200) {
            resolve(res.attention)
          } else {
            reject(res.message)
          }
        }).catch(err => reject(err))
      })
    }
  }
}
