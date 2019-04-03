<template>
  <Card shadow>
    <div>
      <div class="message-page-con message-category-con">
        <Menu width="auto"
              active-name="draftNotice"
              @on-select="handleSelect">
          <!-- 发布公告栏目名 -->
          <MenuItem name="draftNotice">
          <span class="category-title">发布公告</span>
          <Badge style="margin-left: 10px"
                 :count="draftNoticeCount"></Badge>
          </MenuItem>
          <!-- 历史公告栏目名 -->
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
              active-name="直接发布"
              :class="titleClass"
              @on-select="handleView">
          <!-- 添加草稿的按钮 -->
          <Tooltip content="点击写公告"
                   style="width:100%;">
            <MenuItem name="直接发布"
                      v-show="currentNoticeType!=='pastNotice'"
                      style="text-align: center;">
            <Icon type="md-add"
                  :size='24' />
            </MenuItem>
          </Tooltip>
          <!-- 题目 -->
          <MenuGroup :title="menuGroupTitle">

            <MenuItem v-for="item in noticeList"
                      :name="item.notice_uid"
                      :key="`notice_${item.notice_uid}`">
            <div>
              <p class="msg-title">{{ item.title }}</p>
              <Badge :status="currentNoticeType==='pastNotice'? 'default':'error'"
                     :text="badgeText+item.time" />
              <div style="float:right;">
                <tooltip content="删除">
                  <Button :style="{ display: item.loading ? 'inline-block !important' : '' ,padding: '5px'}"
                          :loading="item.loading"
                          size="large"
                          custom-icon="iconfont icon-shanchu btn-icon-gray"
                          type="text"
                          @click.native.stop="delNotice(item)">
                  </Button>
                </tooltip>
                <tooltip content="发布">
                  <Button :style="{ display: item.sendLoading ? 'inline-block !important' : '',padding: '5px' }"
                          :loading="item.sendLoading"
                          size="large"
                          custom-icon="iconfont icon-fabu btn-icon-blue"
                          type="text"
                          v-show="currentNoticeType==='draftNotice'"
                          @click.native.stop="handleDraftNotice(item)">
                  </Button>
                </tooltip>
              </div>
            </div>
            </MenuItem>
          </MenuGroup>

        </Menu>
      </div>
      <!-- 公告展示 -->
      <div class="message-page-con message-view-con"
           v-if="!newNotice">
        <Spin fix
              v-if="contentLoading"
              size="large"></Spin>
        <div class="message-view-header">
          <h2 class="message-view-title">{{ oneContent.title }}</h2>
          <time class="message-view-time">{{ oneContent.time }}</time>

        </div>
        <div>{{oneContent.content}}</div>
      </div>
      <!-- 编辑框 -->
      <div class="message-page-con message-view-con edit-notice"
           v-if="newNotice">
        <Tooltip>
          <input v-model="titleVal"
                 :placeholder="currentNoticeType==='draftNotice'?'这里是公告标题':'这里是问题'"
                 class="edit-input" />
          <div slot="content">字数：{{ titleVal.length }}/40</div>
        </Tooltip>
        <Tooltip>
          <Input v-model="contentVal"
                 type="textarea"
                 placeholder="这里是公告内容"
                 element-id="content-textarea" />
          <div slot="content">字数：{{ contentVal.length }}/200</div>
        </Tooltip>
        <div class="btn-submit">
          <Button type="success"
                  @click="handleSaveToDraft"
                  style=" width: 30%;font-size:18px;letter-spacing:4px;">保存到草稿箱</Button>
          <Button type="primary"
                  @click="handleSendToPast"
                  style=" width: 30%;font-size:18px;letter-spacing:4px;">直接发布</Button>
        </div>

      </div>

    </div>
  </Card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { sendNewNotice, delNoticeById, saveDraftNotice, sendDraftNotice, saveAnswers, delAnswers } from '@/api/classCenter'
const listDic = {
  draftNotice: 'draftNoticeList',
  pastNotice: 'pastNoticeList'
}
export default {
  name: 'notice',
  data () {
    return {
      contentLoading: false,
      newNotice: false,
      currentNoticeType: 'draftNotice',
      noticeContent: {},
      titleVal: '',
      contentVal: ''
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
          'not-unread-list': this.currentNoticeType === 'pastNotice'
        }
      }
    }),
    oneContent () {
      return this.noticeContent
    },
    // 分别获取各类公告的数量
    ...mapGetters([
      'draftNoticeCount',
      'pastNoticeCount'
    ]),
    menuGroupTitle () {
      if (this.currentNoticeType === 'draftNotice') {
        return '草稿箱'
      } else {
        return '历史公告'
      }
    },
    badgeText () {
      if (this.currentNoticeType === 'draftNotice') {
        return '保存于：'
      } else {
        return '发布于：'
      }
    }
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
    },
    // 选择哪一题目展示其内容，selection的值有两种类型，一种是notice_uid和‘直接发布’
    handleView (selection) {
      if (selection === '直接发布') {
        this.newNotice = true
      } else {
        this.contentLoading = true
        const item = this.noticeList.find(item => item.notice_uid === selection)
        setTimeout(() => {
          this.stopLoading('contentLoading')
          this.noticeContent = item

        }, 1500)
        this.newNotice = false
      }


    },
    // 通过公告的id删除公告
    delNotice (item) {
      item.loading = true
      const notice_uid = item.notice_uid
      const index = this.noticeList.findIndex(item => item.notice_uid === notice_uid)
      this.$Modal.confirm({
        title: '删除确认',
        content: '删除之后不可恢复，确定删除吗？',
        onOk: () => {
          // 设置时间间隔，1.5秒之后，再删除，让loading动画效果显示1.5秒
          // 删除公告
          setTimeout(() => {
            delNoticeById({ notice_uid }).then(res => {
              if (res.status === 200) {
                this.noticeList.splice(index, 1)
                this.noticeContent = {}
                this.$Message.success(res.message)
              } else {
                this.$Message.error(res.message)
                item.loading = false
              }
            }).catch(err => {
              this.$Modal.error({
                title: '删除失败，请联系管理员。',
                content: err
              })
              item.loading = false
            })
          }, 1500)

        },
        onCancel: () => {
          item.loading = false
        }
      })

    },
    // 发布草稿箱的公告
    handleDraftNotice (item) {
      item.sendLoading = true
      const notice_uid = item.notice_uid
      const index = this.noticeList.findIndex(item => item.notice_uid === notice_uid)
      setTimeout(() => {
        sendDraftNotice({ notice_uid }).then(res => {
          if (res.status === 200) {
            item.time = res.add_time
            item.sendLoading = false
            console.log(item)
            this.pastNoticeList.unshift(item)
            this.noticeList.splice(index, 1)
            this.noticeContent = {}
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
    // 保存到草稿箱
    handleSaveToDraft () {
      let title = this.titleVal
      let content = this.contentVal
      if (title && content) {
        saveDraftNotice({
          title: title,
          content: content
        }).then(res => {
          if (res.status === 200) {
            this.draftNoticeList.unshift({
              title: title,
              content: content,
              time: res.add_time,
              notice_uid: res.notice_uid
            })
            this.handleReset()
            this.$Message.success({
              content: res.message,
              duration: 3
            })
          } else {
            this.$Message.error({
              content: res.message,
              duration: 3
            })
          }
        }).catch(err => {
          this.$Modal.error({
            title: '保存失败，请联系管理员。',
            content: err
          })
        })
      } else {
        this.$Modal.warning({
          title: '错误警告',
          content: '请填写标题和内容。'
        })
      }

    },
    // 直接发布
    handleSendToPast () {
      let title = this.titleVal
      let content = this.contentVal
      if (title && content) {
        sendNewNotice({
          title: title,
          content: content
        }).then(res => {
          if (res.status === 200) {
            this.pastNoticeList.unshift({
              title: title,
              content: content,
              time: res.add_time,
              notice_uid: res.notice_uid
            })
            this.handleReset()

            this.$Message.success({
              content: res.message,
              duration: 3
            })
          } else {
            this.$Message.error({
              content: res.message,
              duration: 3
            })
          }
        }).catch(err => {
          this.$Modal.error({
            title: '直接发布失败，请联系管理员。',
            content: err
          })
        })
      } else {
        this.$Modal.warning({
          title: '错误警告',
          content: '请填写标题和内容。'
        })
      }

    },
    // 编辑框清空
    handleReset () {
      this.titleVal = ''
      this.contentVal = ''
    }

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
      width: 270px;
    }
    &.message-view-con {
      position: absolute;
      left: 520px;
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
.btn-icon-gray {
  font-size: 18px;
  color: black;
}
.btn-icon-blue {
  font-size: 18px;
  color: #2d8cf0;
}
.edit-notice {
  // background: #eee;
  padding: 0px !important;
  .ivu-tooltip {
    width: 100%;
  }
  .btn-submit {
    margin-top: 30px;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
}
.edit-input {
  width: 60%;
  height: 40px;
  border: none;
  border-bottom: 1.5px solid gray;
  text-align: center;
  outline: none;
  font-size: 24px;
}
.edit-input:focus {
  border-bottom: 2px solid #2d8cf0;
}
#content-textarea {
  margin-top: 20px;
  border: 1.5px solid gray;
  height: 200px;
  font-size: 24px;
}
#content-textarea:focus {
  border: 1.5px solid #2d8cf0;
}
</style>
