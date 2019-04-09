<template>
  <Card shadow>
    <div>
      <div class="message-page-con message-category-con">
        <Menu width="auto"
              active-name="answer">
          <!-- 发布公告栏目名 -->
          <!-- 答疑栏目名 -->
          <MenuItem name="answer">
          <span class="category-title">答疑</span>
          <Badge style="margin-left: 10px"
                 class-name="gray-dadge"
                 :count="answerCount"></Badge>
          </MenuItem>
        </Menu>
      </div>
      <!-- 题目栏 -->
      <div class="message-page-con message-list-con">

        <Menu width="auto"
              active-name="写答疑"
              @on-select="handleView">
          <!-- 添加草稿的按钮 -->
          <Tooltip content="点击写答疑"
                   style="width:100%;">
            <MenuItem name="写答疑"
                      style="text-align: center;">
            <Icon type="md-create"
                  :size='24' />
            </MenuItem>
          </Tooltip>
          <!-- 题目 -->
          <MenuGroup title="历史答疑">

            <MenuItem v-for="item in answerList"
                      :name="item.answer_id"
                      :key="`notice_${item.answer_id}`">
            <div>
              <p class="msg-title">{{ item.title }}</p>
              <Badge status="error"
                     :text="'被引用次数：'+item.num+'次'" />
              <div style="float:right;">
                <tooltip content="删除">
                  <Button :style="{ display: item.loading ? 'inline-block !important' : '' ,padding: '5px'}"
                          :loading="item.loading"
                          size="large"
                          custom-icon="iconfont icon-shanchu btn-icon-gray"
                          type="text"
                          @click.native.stop="delAnswer(item)">
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
          <time class="message-view-time">{{ oneContent.label?'关键词：'+ oneContent.label:'' }}</time>
        </div>
        <div>{{oneContent.answer}}</div>
      </div>
      <!-- 编辑框 -->
      <div class="message-page-con message-view-con edit-notice"
           v-if="newNotice">
        <Tooltip>
          <input v-model="titleVal"
                 placeholder="这里是问题"
                 class="edit-input" />
          <div slot="content">字数：{{ titleVal.length }}/40</div>
        </Tooltip>
        <Tooltip>
          <Input v-model="contentVal"
                 type="textarea"
                 placeholder="这里是答案"
                 element-id="content-textarea" />
          <div slot="content">字数：{{ contentVal.length }}/200</div>
        </Tooltip>
        <div class="btn-submit">
          <Upload action="/class_center/answer_file"
                  name="myfiles"
                  accept=".xls, .xlsx"
                  :show-upload-list="false"
                  :on-error="handleUploadError"
                  :on-progress="handleUploadProgress"
                  :on-success="handleUploadSuccess">
            <Button type="success"
                    style=" font-size:18px;letter-spacing:4px;">上传资料</Button>
          </Upload>
          <Button type="success"
                  @click="handleDownloadAnswer"
                  style=" width: 20%;font-size:18px;letter-spacing:4px;">下载模板</Button>
          <Button type="primary"
                  @click="handleReset"
                  style=" width: 20%;font-size:18px;letter-spacing:4px;">清空</Button>
          <Button type="primary"
                  @click="handleSaveAnswer"
                  style=" width: 20%;font-size:18px;letter-spacing:4px;">保存</Button>
        </div>

      </div>

    </div>
  </Card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { sendNewNotice, delNoticeById, saveDraftNotice, sendDraftNotice, saveAnswers, delAnswers, downloadAnswer } from '@/api/classCenter'
import { downloadBlob } from '@/api/file'
export default {
  name: 'notice',
  data () {
    return {
      contentLoading: false,
      newNotice: false,
      noticeContent: {},
      titleVal: '',
      contentVal: ''
    }
  },
  computed: {
    // 别分获取各类公告的所有信息
    ...mapState({
      answerList: state => state.user.answerList,
    }),
    oneContent () {
      return this.noticeContent
    },
    // 分别获取各类公告的数量
    ...mapGetters([
      'answerCount'
    ]),
  },
  methods: {
    ...mapActions([
      'getPastAnswer'
    ]),
    stopLoading (name) {
      this[name] = false
    },
    // 选择哪一题目展示其内容，selection的值有两种类型，一种是answer_id和‘直接发布’
    handleView (selection) {
      if (selection === '写答疑') {
        this.newNotice = true
      } else {
        this.contentLoading = true
        const item = this.answerList.find(item => item.answer_id === selection)
        setTimeout(() => {
          this.stopLoading('contentLoading')
          this.noticeContent = item

        }, 1500)
        this.newNotice = false
      }

    },
    // 通过答疑的id删除公告
    delAnswer (item) {
      item.loading = true
      const answer_id = item.answer_id
      const index = this.answerList.findIndex(item => item.answer_id === answer_id)
      this.$Modal.confirm({
        title: '删除确认',
        content: '删除之后不可恢复，确定删除吗？',
        onOk: () => {
          // 设置时间间隔，1.5秒之后，再删除，让loading动画效果显示1.5秒

          //删除历史答疑
          setTimeout(() => {
            delAnswers({ answer_id: answer_id }).then(res => {
              if (res.status === 200) {
                this.answerList.splice(index, 1)
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

    // 答疑编辑框清空
    handleReset () {
      this.titleVal = ''
      this.contentVal = ''
    },
    // 答疑编辑框提交数据
    handleSaveAnswer () {
      let title = this.titleVal
      let answer = this.contentVal
      if (title && answer) {
        saveAnswers({
          title: title,
          answer: answer
        }).then(res => {
          if (res.status === 200) {
            this.answerList.unshift({
              title: title,
              answer: answer,
              label: res.label,
              num: 0,
              answer_id: res.answer_id
            })
            this.handleReset()

            this.$Message.success('添加成功！')
          } else {
            this.$Message.error(res.message)
          }
        }).catch(err => console.log(err))
      } else {
        this.$Modal.warning({
          title: '错误警告',
          content: '请填写标题和内容。'
        })
      }

    },
    // 下载答疑模板
    handleDownloadAnswer () {
      downloadAnswer().then(res => downloadBlob(res, '答疑模板.xls')).catch(err => console.log(err))
    },
    // 上传成功后
    handleUploadSuccess () {
      this.$Spin.hide();
      this.$Message.success('上传成功，后台已收到数据！')
    },
    // 上传中
    handleUploadProgress () {
      this.$Spin.show();
    },
    // 上传失败
    handleUploadError () {
      this.$Spin.hide();
      this.$Message.error('上传失败！')

    },
  },
  mounted () {
    // 请求获取消息列表
    this.getPastAnswer().then(res => {
    }).catch(err => {
      this.$Modal.error({
        title: '获取历史答疑数据失败，请联系管理员。',
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
.msg-title {
  font-size: 18px !important;
}
</style>
