import {
  login,
  logout
} from '@/api/user'
import {
  setToken,
  getToken
} from '@/libs/util'
import {
  getAllNotice
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
    pastNoticeCount: state => state.pastNoticeList.length
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
    },

    // 获取所有的公告
    getAllNotice({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getAllNotice().then(res => {
          commit('setdraftNoticeList', res.draft_notices.map(_ => {
            _.delLoading = false
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

    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          const {
            unread,
            readed,
            trash
          } = res.data
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId({
      state,
      commit
    }, {
      msg_id
    }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then(res => {
            const content = res.data
            commit('updateMessageContentStore', {
              msg_id,
              content
            })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead({
      state,
      commit
    }, {
      msg_id
    }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded({
      commit
    }, {
      msg_id
    }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash({
      commit
    }, {
      msg_id
    }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
