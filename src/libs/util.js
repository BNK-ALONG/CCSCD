import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import {
  forEach,
  hasOneOf,
  objEqual
} from '@/libs/tools'

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: config.cookieExpires || 1
  })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = {
    ...homeRoute,
    icon: homeRoute.meta.icon
  }
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hide
  }).map(item => {
    let meta = {
      ...item.meta
    }
    if (meta.title && typeof meta.title === 'function') meta.title = meta.title(route)
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{
    ...homeItem,
    to: homeRoute.path
  }, ...res]
}

export const getRouteTitleHandled = (route) => {
  let router = {
    ...route
  }
  let meta = {
    ...route.meta
  }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') title = meta.title(router)
    else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  let title = item.meta.title
  if (vm.$config.useI18n) {
    if (title.includes('{{') && title.includes('}}') && vm.$config.useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
    else title = vm.$t(item.name)
  } else title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}


/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @description 本地存储课堂名
 */
export const setClassNameInLocalstorage = className => {
  localStorage.setItem('className', className);
}

/**
 * @returns {String} 从Localstorage中获取课堂名
 */
export const getClassNameFromLocalstorage = () => {
  const className = localStorage.getItem('className')
  return className ? className : '课堂名获取失败'
}

/**
 * @description 本地存储二维码的base64编码
 */
export const setQRbs64InLocalstorage = QRbs64 => {
  localStorage.QRbs64 = QRbs64
}

/**
 * @returns {String} 从Localstorage中获取二维码的base64编码
 */
export const getQRbs64FromLocalstorage = () => {
  const QRbs64 = localStorage.QRbs64
  return QRbs64
}

/**
 * @param {Object} 临时存储课程的六大数字信息
 */
export const setClassNumberInSessionstorage = (classNumber) => {
  sessionStorage.setItem('classNumber', JSON.stringify(classNumber))
}

/**
 * @returns {Object} 从Sessionstorage中获取课程的六大数字信息
 */
export const getClassNumberFromSessionstorage = () => {
  const classNumber = sessionStorage.classNumber
  return classNumber ? JSON.parse(classNumber) : {
    'students': 19,
    'download': 20,
    'questions': 50,
    'sign': 10,
    'notices': 5,
    'files': 5
  }
}

/**
 * @param {Boolean} 存储是否开课
 */
export const setIsStartingLocalstorage = (isStarting) => {
  localStorage.setItem('isStarting', Number(isStarting))
}

/**
 * @returns {Number} 从LocalStorage获取是否开课，'0'，'1'
 */
export const getIsStartingLocalstorage = () => {
  const isStarting = localStorage.isStarting
  return isStarting ? parseInt(isStarting) : 0
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const {
    name,
    path,
    meta
  } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({
    name,
    path,
    meta
  })
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query(已修改)判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  // const query1 = route1.query || {}
  // const query2 = route2.query || {} && objEqual(query1, query2)
  return (route1.name === route2.name) && objEqual(params1, params2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

//处理课堂开学日期的函数
export const forClassTime = (daterange) => {
  let time = daterange.match(/\d{2}/g)
  let year = time[1]
  let month = ''
  let Number_month = parseInt(time[2])
  switch (Number_month) {
    case (1):
      month = '1月'
      break;
    case (2):
      month = '2月'
      break;
    case (3):
      month = '3月'
      break;
    case (4):
      month = '4月'
      break;
    case (5):
      month = '5月'
      break;
    case (6):
      month = '6月'
      break;
    case (7):
      month = '7月'
      break;
    case (8):
      month = '8月'
      break;
    case (9):
      month = '9月'
      break;
    case (10):
      month = '10月'
      break;
    case (11):
      month = '11月'
      break;
    case (12):
      month = '12月'
      break;
  }
  return [year, month]
}
// 历史签到折线图的配置项
export const getSignOption = (allSignList) => {
  return {
    animation: true,
    dataset: {
      dimensions: ['sign_time', 'signed_num', 'unsigned_num'],
      source: allSignList
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['已签到', '未签到']
    },
    // 图表组件的样式
    grid: {
      show: true,
      left: '3%',
      right: '4%',
      containLabel: true,
    },
    // 图表的工具栏
    toolbox: {
      show: true,
      feature: {
        dataView: {
          readOnly: false
        },
        magicType: {
          type: ['line', 'bar']
        },
        restore: {},
        saveAsImage: {}
      }
    },
    textStyle: {
      fontSize: 16,
      color: '#000'
    },
    // 图表的区域缩放
    dataZoom: [{
      type: 'slider',
      start: 0,
      end: 20,
      realtime: true,
      show: true,
      showDataShadow: true
    }, {
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 5,
        shadowColor: 'rgba(0, 0, 0, 0.6)'
      }
    }],
    xAxis: {
      name: '时间',
      type: 'category',
      boundaryGap: false,
      // 坐标轴的样式
      axisLine: {
        lineStyle: {
          color: '#606060',
        },
        symbol: ['none', 'arrow'],
        symbolOffset: 18
      },
    },
    yAxis: {
      name: '人数',
      type: 'value',
      // 坐标轴的样式
      axisLine: {
        lineStyle: {
          color: '#606060',
        },
        symbol: ['none', 'arrow'],
        symbolOffset: 15
      },

    },
    series: [{
        name: '已签到',
        type: 'line',
        color: '#19BE6B'
      },
      {
        name: '未签到',
        type: 'line',
        color: '#ED4014'
      }
    ]
  }
}
// 提问词柱状图的配置项
export const getWordsOption = (topWordList) => {
  return {
    legend: {},
    textStyle: {
      fontSize: 16
    },
    tooltip: {

      formatter: function (params, ticket, callback) {
        let color = params.color
        let seriesIndex = params.seriesIndex
        let showHtml
        switch (seriesIndex) {
          case 0:
            showHtml = params.data.time + '<br>' + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + color + ';"></span>' + params.data.letter1 + '：' + params.data.frequency1 + '次'
            break;
          case 1:
            showHtml = params.data.time + '<br>' + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + color + ';"></span>' + params.data.letter2 + '：' + params.data.frequency2 + '次'

            break;
          case 2:
            showHtml = params.data.time + '<br>' + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + color + ';"></span>' + params.data.letter3 + '：' + params.data.frequency3 + '次'
            break;
        }
        return showHtml
      }
    },
    dataset: {
      dimensions: ['time', 'letter1', 'letter2', 'letter3', 'frequency1', 'frequency2', 'frequency3'],
      source: topWordList
    },
    xAxis: {
      name: '时间',
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#606060',
        },
        symbol: ['none', 'arrow'],
        symbolOffset: 18
      },
    },
    yAxis: {
      name: '提问量',
      max: (value) => {
        return value.max + value.max / 4
      },
      axisLine: {
        lineStyle: {
          color: '#606060',
        },
        symbol: ['none', 'arrow'],
        symbolOffset: 15
      },
    },
    series: [{
        type: 'bar',
        dimensions: ['time', 'letter1', 'letter2', 'letter3', 'frequency1', 'frequency2', 'frequency3'],

        encode: {

          x: 'time',
          y: ['frequency1']
        },
        label: {
          show: true,
          formatter: '{@letter1}',
          position: 'top'
        }
      },
      {
        type: 'bar',
        encode: {
          x: 'time',
          y: ['frequency2']
        },
        label: {
          show: true,
          formatter: '{@letter2}',
          position: 'top'
        }
      },
      {
        type: 'bar',
        encode: {
          x: 'time',
          y: ['frequency3']
        },
        label: {
          show: true,
          formatter: '{@letter3}',
          position: 'top'
        }
      }
    ]

  }
}

// 文件下载量柱状图的配置项
export const getDownloadOption = (downloadList) => {
  return {
    title: {
      text: '本课程的文件下载量',
      x: 'center'
    },
    textStyle: {
      fontSize: 16,
      color: '#000'
    },
    dataset: {
      dimensions: ['file_name', 'download_num'],
      source: downloadList
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '20%'
    },
    xAxis: {
      name: '下载量',
      type: 'value',
      max: (value) => {
        return value.max * 2
      },
      axisLine: {
        lineStyle: {
          color: '#606060',
        },
        symbol: ['none', 'arrow'],
        symbolOffset: 18
      },
    },
    yAxis: {
      name: '文件名',
      type: 'category',
      nameTextStyle: {
        color: '#000',
        fontStyle: 'italic',
        fontSize: 18,
        align: 'right',
      },
      axisLine: {
        lineStyle: {
          color: '#606060',
        },
        symbol: ['none', 'arrow'],
        symbolOffset: 15
      },
    },
    series: [{
      name: '总下载量',
      type: 'bar'
    }]
  }
}
