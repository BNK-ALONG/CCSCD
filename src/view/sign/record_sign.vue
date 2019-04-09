<template>
  <div class="card-wrap">
    <Card shadow
          style="background:#eee;">
      <Card shadow
            title="当前签到记录">
        <Button type="success"
                slot="extra"
                icon="ios-download-outline"
                custom-icon="btn-icon"
                @click="handleNewSignRecord">当前数据导出</Button>

        <Row :gutter="20"
             style="margin-top: 10px;">
          <i-col span="8"
                 push='4'>

            <time-down style="margin:0px auto;"
                       :setTimer='setTimer'
                       ref="timeDown"
                       color="rgb(45, 183, 245)"></time-down>
            <br><br>

            <div>
              <Button type="success"
                      shape="circle"
                      size="large"
                      @click="handleResign">重新发布</Button>
              <Button type="success"
                      shape="circle"
                      size="large"
                      style="margin-left:1em;"
                      :loading="btnLoading"
                      @click="handleCancelSign">取消签到</Button>
            </div>

          </i-col>
          <i-col span="8"
                 push='2'>
            <chart-pie style="height: 300px;"
                       :value="pieData"
                       text="当前签到统计图"></chart-pie>
          </i-col>

        </Row>
        <Divider>当前学生签到情况详细</Divider>

        <!-- </Card> -->
        <!-- <Card style="margin-top:10px;height:auto;"> -->
        <div class="drag-box-card">
          <!-- 切记设置list1和list2属性时，一定要添加.sync修饰符 -->
          <drag-list :list1.sync="list1"
                     :list2.sync="list2"
                     :dropConClass="dropConClass"
                     @on-change="handleChange">
            <h3 slot="left-title">未签到:{{list1.length}} 人</h3>
            <Alert slot="left"
                   ref="alert"
                   :key="left.itemLeft.stuid"
                   slot-scope="left"
                   type="error"
                   show-icon
                   closable
                   style="cursor:move;"
                   @on-close="handleChangeSign(left.itemLeft,left.index)">{{ left.itemLeft.stuid }}<span style="margin-right:2em;"></span>{{ left.itemLeft.classnum }}<span style="margin-right:2em;"></span>{{ left.itemLeft.stuname }}
              <div slot="close">修改
                <Icon type="md-return-right" />
              </div>

            </Alert>
            <h3 slot="right-title">已签到:{{list2.length}} 人</h3>

            <Alert slot="right"
                   slot-scope="right"
                   type="success"
                   style="cursor:not-allowed;padding: 8px 0px 8px 38px;"
                   show-icon>{{right.itemRight.stuid }} <span style="margin-right:2em;"></span>{{ right.itemRight.classnum}}<span style="margin-right:2em;"></span>{{ right.itemRight.stuname }}<span style="margin-right:2em;"></span>{{ right.itemRight.status }}
            </Alert>
          </drag-list>
        </div>
      </Card>
    </Card>

  </div>
</template>
<script>
import DragList from '_c/drag-list'
import timeDown from '_c/timeDown'
import { allSignRecord, newSignRecord, updateSignRecord, nowSignRecord, cancelSign } from '@/api/sign'
import { ChartPie } from '_c/charts'
import { downloadBlob } from '@/api/file'
import { mapGetters } from 'vuex'

export default {
  name: 'record_sign',
  components: {
    DragList,
    ChartPie,
    timeDown,
  },
  data () {
    return {
      list1: [],
      list2: [],
      dropConClass: {
        left: ['drop-box', 'left-drop-box'],
        right: ['drop-box', 'right-drop-box']
      },
      handleList: [],
      signRemark: '补签',
      btnLoading: false,
      setTimer: 0
    }
  },
  created () {
    this.getNowSignRecord()
    this.setTimer = sessionStorage.getItem('interval') ? parseInt(sessionStorage.getItem('interval')) : 0


  },
  activated () {
    this.getTimeLeft()
    this.getNowSignRecord()

  },
  mounted () {
    this.getTimeLeft()
  },
  computed: {
    unSignLength () {
      return this.list1.length
    },
    signedLength () {
      return this.list2.length - this.late - this.leave
    },
    late () {
      let lateLen = 0
      for (let student of this.list2) {
        let status = student.status
        if (status === '迟到') {
          lateLen += 1
        }
      }
      return lateLen
    },
    leave () {
      let leaveLen = 0
      for (let student of this.list2) {
        let status = student.status
        if (status === '请假') {
          leaveLen += 1
        }
      }
      return leaveLen
    },
    pieData () {
      return [
        { value: this.signedLength, name: '已签到' },
        { value: this.late, name: '迟到' },
        { value: this.leave, name: '请假' },
        { value: this.unSignLength, name: '未签到' }
      ]
    },

  },
  methods: {
    getTimeLeft () {
      let interval = parseInt(sessionStorage.getItem('interval'))
      let startTime = parseInt(sessionStorage.getItem('startTime'))
      if (interval) {
        let endTime = interval + startTime
        let nowTime = Date.now()
        let residueTime = endTime - nowTime
        if (residueTime > 0) {
          this.$refs.timeDown.timeLeft = Math.round(residueTime / 1000) * 1000
        } else {
          return
        }
      }
    },

    // 获取当前签到记录
    getNowSignRecord () {
      nowSignRecord().then(res => {
        if (res.status === 200) {
          this.list1 = res.unsigned_record
          this.list2 = res.signed_record
        } else {
          this.$Message.error(res.message)
        }
      }).catch(err => console.log(err))
    },

    // 两个列表的变化
    handleChange ({ oldIndex, newIndex }) {
      this.signRemarkModal(this.list2[newIndex], 'drag', newIndex, oldIndex)
    },
    // 获取当前签到情况表
    handleNewSignRecord () {
      newSignRecord().then(res => {
        downloadBlob(res, '最新签到表.xls')
      }).catch(err => {
        this.$Modal.error({
          title: '获取最新签到表失败！请联系管理员。',
          content: err
        })
      })
    },

    // 备注消息的对话框内容
    signRemarkModal (student, alterType, ...args) {
      let self = this
      let status = '补签'
      let index = args[0]
      let index2 = args[1]
      self.$Modal.confirm({
        title: '修改未签到同学的状态备注信息',
        render: (h) => {
          return h('div', [
            // 第一个输入框
            h('Input', {
              style: {
                margin: '10px',
                width: '70%'
              },
              props: {
                value: student.stuid,
                disabled: true
              }
            }, [
                h('span', {
                  props: {},
                  slot: 'prepend'
                }, '学生学号')
              ]),
            // 第二个输入框
            h('Input', {
              style: {
                margin: '10px',
                width: '70%'
              },
              props: {
                value: student.stuname,
                disabled: true
              }
            }, [
                h('span', {
                  props: {},
                  slot: 'prepend'
                }, '学生姓名')
              ]),
            // 选择备注信息
            h('span', {
              style: {
                margin: '10px',
                width: '70%'
              },
            }, '备注信息'),
            h('RadioGroup', {
              props: {
                value: status
              },
              on: {
                input: (value) => {
                  status = value
                }
              }
            }, [
                h('Radio', {
                  props: {
                    trueValue: '已签到',
                    label: '补签'
                  },
                }),
                h('Radio', {
                  props: {
                    label: '迟到'
                  },
                }),
                h('Radio', {
                  props: {
                    label: '请假'
                  },
                })
              ])
          ])
        },
        onOk: () => {
          status === '补签' ? student.status = '已签到' : student.status = status
          if (alterType === 'Alert') {
            self.list1.splice(index, 1)
            self.list2.push(student)
          }
          updateSignRecord({
            stuid: student.stuid,
            status: student.status
          }).then(res => {
            if (res.status === 200) {
              self.$Message.success('修改成功!')
            } else {
              self.$Message.error('修改失败!')
            }
          }).catch(err => {
            console.log(err)
          })
        },
        // 取消修改备注消息，强制Alert警告提示框不关闭（默认时关闭的）
        onCancel: () => {
          if (alterType === 'Alert') {
            self.$refs.alert.closed = false
          } else {
            let student = self.list2.splice(index, 1)
            self.list1.splice(index2, 0, student[0])
          }
        }
      })
    },

    // 事件：修改签到状态
    handleChangeSign (student, index) {
      this.signRemarkModal(student, 'Alert', index)
    },
    // 重新发布签到
    handleResign () {
      let interval = sessionStorage.getItem('interval')
      if (interval) {
        cancelSign().then(res => {
          if (res.status === 200) {
            sessionStorage.removeItem("interval")
            sessionStorage.removeItem("startTime")
            this.$refs.timeDown.timeLeft = 0
          } else {
            this.$Message.error(res.message)
          }
        }).catch(err => this.$Message.error(err))
      }
      this.$router.push({
        name: 'issue_sign'
      })
    },
    // 取消签到
    handleCancelSign () {
      this.$Modal.confirm({
        title: '确定取消',
        content: '取消本次签到，学生不可再进行签到，确定取消吗？',
        onOk: () => {
          this.btnLoading = true
          cancelSign().then(res => {
            setTimeout(() => {
              this.btnLoading = false
              if (res.status === 200) {
                sessionStorage.removeItem("interval")
                sessionStorage.removeItem("startTime")
                this.$refs.timeDown.timeLeft = 0
                this.$Message.success(res.message)
              } else {
                this.$Message.error(res.message)
              }
            }, 2000)
          }).catch(err => this.$Message.error(err))
        }

      })

    }
  },

}
</script>
<style lang="less">
.drag-box-card {
  display: inline-block;
  width: 600px;
  height: 560px;
  .drag-item {
    margin: 10px;
  }
  h3 {
    padding: 10px 15px;
  }
  .drop-box {
    border: 1px solid #eeeeee;
    height: 455px;
    border-radius: 5px;
  }
  .left-drop-box {
    margin-right: 10px;
  }
}
.drag-list-con {
  h3 {
    font-weight: bold !important;
  }
}
.ivu-card-extra {
  right: 1px !important;
  top: 9px !important;
}
.btn-icon {
  font-size: 16px;
}
</style>
