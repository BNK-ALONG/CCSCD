import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead,
  setClassNameInLocalstorage,
  getClassNameFromLocalstorage,
  setQRbs64InLocalstorage,
  getQRbs64FromLocalstorage,
  setClassNumberInSessionstorage,
  getClassNumberFromSessionstorage
} from '@/libs/util'
import beforeClose from '@/router/before-close'
import {
  saveErrorLogger
} from '@/api/data'
import {
  courseLogin,
  getQRImg,
  classNumber
} from '@/api/sign'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
const {
  homeName
} = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers, homeName),
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false,
    className: getClassNameFromLocalstorage(),
    QRbs64: getQRbs64FromLocalstorage(),
    classNumber: getClassNumberFromSessionstorage()
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access),
    errorCount: state => state.errorList.length
  },
  mutations: {
    setBreadCrumb(state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setTagNavList(state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag(state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag(state, {
      route,
      type = 'unshift'
    }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal(state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError(state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus(state, status = true) {
      state.hasReadErrorPage = status
    },
    //课堂名
    setClassName(state, className) {
      state.className = className
      setClassNameInLocalstorage(className)
    },
    setQRbs64(state, QRbs64) {
      state.QRbs64 = QRbs64
      setQRbs64InLocalstorage(QRbs64)
    },
    setClassNumber(state, classNumber) {
      state.classNumber = classNumber
      setClassNumberInSessionstorage(classNumber)
    }
  },
  actions: {
    addErrorLog({
      commit,
      rootState
    }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      const {
        user: {
          token,
          userId,
          userName
        }
      } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
      saveErrorLogger(info).then(() => {
        commit('addError', data)
      })
    },
    /**
     *   @description 请求课堂登录接口获取课堂名
     * @returns {Promise} 200存储课堂名并返回message，201返回message
     */
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
    /**
     *   @description 请求课堂登录接口获取二维码的路径
     * 200存储二维码的路径并返回二维码的路径，201返回"获取二维码失败"
     */
    getQRbs64({
      commit
    }) {
      getQRImg().then(res => {
        if (res) {
          const QRbs64 = 'data:image/png;base64,' + res
          commit("setQRbs64", QRbs64)
        } else {
          commit("setQRbs64", '@/assets/images/error-qr.jpg')
        }
      }).catch(error => {
        console.log("获取二维码失败：", error)
      })
    },

    /**
     *   @description 课堂登录之后获取课堂的六大数字信息
     * 200临时存储六大数字信息，201后台打印错误
     */
    getClassNumber({
      commit
    }) {
      classNumber().then(res => {
        if (res.status === 200) {
          commit("setClassNumber", res.number)
        } else {
          console.log('获取本课堂数字信息失败。')
        }
      }).catch(err => console.log(err))
    }
  }
}
