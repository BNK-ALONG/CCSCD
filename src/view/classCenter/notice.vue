<template>
  <Card shadow>
    <div>
      <div class="message-page-con message-category-con">
        <Menu width="auto"
              active-name="newNotice"
              @on-select="handleSelect">
          <MenuItem name="draftNotice">
          <span class="category-title">发布公告</span>
          <Badge style="margin-left: 10px"
                 :count="draftNoticeCount"></Badge>
          </MenuItem>
          <MenuItem name="pastNotice">
          <span class="category-title">历史公告</span>
          <Badge style="margin-left: 10px"
                 class-name="gray-dadge"
                 :count="pastNoticeCount"></Badge>
          </MenuItem>
        </Menu>
      </div>
      <!-- 题目栏 -->
      <div class="message-page-con message-list-con">
        <Menu width="auto"
              active-name=""
              :class="titleClass"
              @on-select="handleView">
          <MenuItem>
          <Icon type="md-add" />
          </MenuItem>
          <MenuItem v-for="item in noticeList"
                    :name="item.notice_uid"
                    :key="`notice_${item.notice_uid}`">
          <div>
            <p class="msg-title">{{ item.title }}</p>
            <Badge :status="currentNoticeType==='draftNotice'? 'error':'default'"
                   :text="item.time" />
            <Button :style="{ display: item.delLoading ? 'inline-block !important' : '' ,padding: '5px'}"
                    :loading="item.delLoading"
                    size="large"
                    custom-icon="iconfont icon-shanchu btn-icon-red"
                    title='删除'
                    type="text"
                    @click.native.stop="delNotice(item)"></Button>
            <Button :style="{ display: item.sendLoading ? 'inline-block !important' : '',padding: '5px' }"
                    :loading="item.sendLoading"
                    size="large"
                    custom-icon="iconfont icon-fabu btn-icon-blue"
                    title='发布'
                    type="text"
                    v-show="currentNoticeType==='draftNotice'"
                    @click.native.stop="handleDraftNotice(item)"></Button>
          </div>
          </MenuItem>
        </Menu>
      </div>

      <div class="message-page-con message-view-con">
        <Spin fix
              v-if="contentLoading"
              size="large"></Spin>
        <div class="message-view-header">
          <h2 class="message-view-title">{{ noticeContent.title }}</h2>
          <time class="message-view-time">{{ noticeContent.time }}</time>
        </div>
        <div>{{noticeContent.content}}</div>
      </div>
    </div>
  </Card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { sendNewNotice, delNoticeById, saveDraftNotice, sendDraftNotice } from '@/api/classCenter'
const listDic = {
  draftNotice: 'draftNoticeList',
  pastNotice: 'pastNoticeList'
}
export default {
  name: 'notice',
  data () {
    return {
      contentLoading: false,
      currentNoticeType: 'draftNotice',
      noticeContent: {}
    }
  },
  computed: {
    // 别分获取各类公告的所有信息
    ...mapState({
      draftNoticeList: state => state.user.draftNoticeList,
      pastNoticeList: state => state.user.pastNoticeList,
      noticeList () {
        return this[listDic[this.currentNoticeType]]
      },
      titleClass () {
        return {
          'not-unread-list': this.currentNoticeType !== 'draftNotice'
        }
      }
    }),
    // 分别获取各类公告的数量
    ...mapGetters([
      'draftNoticeCount',
      'pastNoticeCount'
    ])
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'getAllNotice'
    ]),
    stopLoading (name) {
      this[name] = false
    },
    // 选择菜单栏中的公告类型
    handleSelect (name) {
      this.currentNoticeType = name
      console.log(name)
      console.log(this.noticeList)
    },
    // 选择哪一题目展示其内容
    handleView (notice_uid) {
      this.contentLoading = true
      const item = this.noticeList.find(item => item.notice_uid === notice_uid)
      this.noticeContent = item
      this.stopLoading('contentLoading')
    },
    // 通过公告的id删除公告
    delNotice (item) {
      item.delLoading = true
      const notice_uid = item.notice_uid
      const index = this.noticeList.findIndex(item => item.notice_uid === notice_uid)
      this.$Modal.confirm({
        title: '删除确认',
        content: '删除公告不可恢复，确定删除吗？',
        onOk: () => {
          const notice_uid = item.notice_uid
          console.log(notice_uid)
          // 设置时间间隔，1.5秒之后，再删除，让loading动画效果显示1.5秒
          setTimeout(() => {
            delNoticeById({ notice_uid }).then(res => {
              if (res.status === 200) {
                this.noticeList.splice(index, 1)
                this.$Message.success(res.message)
              } else {
                this.$Message.error(res.message)
                item.delLoading = false
              }
            }).catch(err => {
              this.$Modal.error({
                title: '删除公告失败，请联系管理员。',
                content: err
              })
              item.delLoading = false
            })
          }, 1500)
        },
        onCancel: () => {
          item.delLoading = false
        }
      })

    },
    handleDraftNotice (item) {
      item.sendLoading = true
      const notice_uid = item.notice_uid
      const index = this.noticeList.findIndex(item => item.notice_uid === notice_uid)
      setTimeout(() => {
        sendNewNotice({ notice_uid }).then(res => {
          if (res.status === 200) {
            item.time = res.add_time
            item.sendLoading = false
            console.log(item)
            this.pastNoticeList.push(item)
            console.log(this.pastNoticeList)
            this.noticeList.splice(index, 1)
            this.$Message.success({
              content: '发布成功！可在历史公告栏查看。',
              duration: 3
            })
          } else {
            this.$Message.error({
              content: res.message,
              duration: 3
            })
            item.sendLoading = false
          }
        }).catch(err => {
          this.$Modal.error({
            title: '发布失败，请联系管理员。',
            content: err
          })
          item.sendLoading = false
        })
      }, 1500)
    },
  },
  mounted () {
    // 请求获取消息列表
    this.getAllNotice().then(res => {
    }).catch(err => {
      this.$Modal.error({
        title: '获取公告数据失败，请联系管理员。',
        content: err
      })
    })
  }
}
</script>

<style lang="less">
.message-page {
  &-con {
    height: ~"calc(100vh - 176px)";
    display: inline-block;
    vertical-align: top;
    position: relative;
    &.message-category-con {
      border-right: 1px solid #e6e6e6;
      width: 200px;
    }
    &.message-list-con {
      border-right: 1px solid #e6e6e6;
      width: 230px;
    }
    &.message-view-con {
      position: absolute;
      left: 446px;
      top: 16px;
      right: 16px;
      bottom: 16px;
      overflow: auto;
      padding: 12px 20px 0;
      .message-view-header {
        margin-bottom: 20px;
        .message-view-title {
          display: inline-block;
        }
        .message-view-time {
          margin-left: 20px;
        }
      }
    }
    .category-title {
      display: inline-block;
      width: 65px;
    }
    .gray-dadge {
      background: gainsboro;
    }
    .not-unread-list {
      .msg-title {
        color: rgb(170, 169, 169);
      }
      .ivu-menu-item {
        .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only {
          display: none;
        }
        &:hover {
          .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only {
            display: inline-block;
          }
        }
      }
    }
  }
}
.btn-icon-red {
  font-size: 18px;
  color: red;
}
.btn-icon-blue {
  font-size: 18px;
  color: #2d8cf0;
}
</style>
