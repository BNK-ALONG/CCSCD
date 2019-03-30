<template>
  <Layout style="height: 100%"
          class="main">
    <Sider hide-trigger
           collapsible
           :width="256"
           :collapsed-width="64"
           v-model="collapsed"
           class="left-sider"
           :style="{overflow: 'hidden'}">
      <side-menu ref="sideMenu"
                 :active-name="$route.name"
                 :collapsed="collapsed"
                 @on-select="turnToPage"
                 :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <div class="className-wrap"
               v-show="!collapsed">
            <div class="className-box className-box-max">{{className}}</div>
          </div>

          <div class="className-wrap"
               v-show="collapsed">
            <div class="className-box className-box-min">{{className[0]}}</div>

          </div>
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed"
                    @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator" />
          <q-RImg></q-RImg>
          <random-stu></random-stu>
          <start-end @on-start-change="handleStartChange"></start-end>
          <!-- 全屏的按钮 -->
          <return-courseList></return-courseList>
          <fullscreen v-model="isFullscreen"
                      style="margin-right: 20px;" />
          <div :class="{'starting-con':true,'animated':true,'bounceInRight':isStarting,'bounceOutRight':!isStarting}">
            <svg class="iconfont-svg"
                 aria-hidden="true"
                 style="font-size: 2.5em;">
              <use xlink:href="#icon-shangkezhong"></use>
            </svg>
          </div>
        </header-bar>

      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route"
                      @input="handleClick"
                      :list="tagNavNoRapid_SignList"
                      @on-close="handleCloseTag" />
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view />
            </keep-alive>
            <ABackTop :height="100"
                      :bottom="80"
                      :right="50"
                      container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import QRImg from './components/QRImg'
import ReturnCourseList from './components/ReturnCourseList'
import StartEnd from './components/Start-End'
import RandomStu from './components/RandomStu'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import './main.less'
require('animate.css/animate.min.css');

export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    TagsNav,
    Fullscreen,
    User,
    ABackTop,
    QRImg,
    ReturnCourseList,
    StartEnd,
    RandomStu
  },
  data () {
    return {
      collapsed: false,
      isFullscreen: false,
      isStarting: false
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagNavNoRapid_SignList () {
      let list = this.tagNavList
      for (let index in list) {
        if (list[index].meta.title === '快速签到') {
          list.splice(index, 1)
        }
      }
      return list
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      return this.$store.state.user.avatorImgPath
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    //获取课堂名
    className () {
      return this.$store.state.app.className
    }

  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleStartChange (isStarting) {
      this.isStarting = isStarting
    }
    ,
    handleCloseTag (res, type, route) {
      if (type === 'all') {
        this.turnToPage(this.$config.homeName)
      } else if (routeEqual(this.$route, route)) {
        if (type !== 'others') {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },

  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }

  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    // this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }

  }
}
</script>
<style lang="less">
.className-wrap {
  /* 父元素根据内容改变大小 */
  width: auto;
  height: 44px;
  display: inline-block;
  background-color: #2d8cf0;
  border-radius: 15px 0px 15px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.className-box {
  color: #fff;
  font-family: "MV Boli";
  /* font-family: "LiSu"; */
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
}
.className-box-max {
  font-size: 20px;
  margin: 0px 10px;
  max-width: 140px;
}
.className-box-min {
  font-size: 24px;
  width: 40px;
  text-align: center;
}
.starting-con {
  font-size: 40px;
  position: absolute;
  left: 40%;
  clear: both;
  top: -5px;
}
</style>
