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

            <keep-alive>
              <time-down style="margin:0px auto;"
                         :setTimer='setTimer'
                         color="rgb(45, 183, 245)"></time-down>
            </keep-alive>
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
import { allSignRecord, newSignRecord, updateSignRecord, nowSignRecord } from '@/api/sign'
import { ChartPie, ChartCate } from '_c/charts'
import { downloadBlob } from '@/api/file'
import { mapGetters } from 'vuex'

export default {
  name: 'record_sign',
  components: {
    DragList,
    ChartPie,
    timeDown,
    ChartCate
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
      signRemark: '补签'
    }
  },
  created () {
    this.getNowSignRecord()
    this.setTimer = sessionStorage.getItem('interval') ? parseInt(sessionStorage.getItem('interval')) : 0
  },
  activated () {
    this.getNowSignRecord()

  },
  computed: {
    // color () {
    //   let color = '#2db7f5'
    //   if (this.percent == 0) {
    //     color = '#5cb85c'
    //   }
    //   return color;
    // },
    // countDown () {
    //   let time = this.residueTime ? this.residueTime * 1000 : 0
    //   console.log(time)
    //   if (time <= 0) {
    //     return '00:00:00'
    //   } else {
    //     let result = []
    //     result.push(Math.floor(time / 3.6e+6))
    //     result.push(Math.floor(time % 3.6e+6 / 60000))
    //     result.push(Math.floor(time % 60000 / 1000))
    //     return result.map(x => x < 10 ? '0' + x : x).join(':')
    //   }
    // },
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
        if (status === '迟到') {
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
    // getNowPercent () {
    //   let startTime = parseInt(sessionStorage.getItem('startTime'))
    //   let interval = parseInt(sessionStorage.getItem('interval'))
    //   if (!startTime) {
    //     return
    //   }
    //   // 过去的时间，单位秒
    //   let pastTime = parseInt((Date.now() - startTime) / 1000)
    //   if (pastTime > interval) {
    //     sessionStorage.removeItem('startTime')
    //     sessionStorage.removeItem('interval')
    //   } else {
    //     let nowPercent = parseInt(pastTime * 100 / interval)
    //     console.log('nowPercent', nowPercent)
    //     this.timeDown(nowPercent)
    //   }
    // },
    // timeDown (nowPercent) {
    //   let interval = parseInt(sessionStorage.getItem('interval'))
    //   console.log('interval', interval)
    //   this.percent = 100 - nowPercent
    //   this.timer = setInterval(() => {
    //     this.percent -= 100 / interval
    //     this.residueTime--
    //     if (this.percent < 0) {
    //       this.percent = 0
    //       clearInterval(this.timer)
    //     }
    //     console.log('this.percent', this.percent)
    //   }, 1000)
    // },
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
      let status = '已签到'
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
            h('Select', {
              style: {
                width: '53%'
              },
              props: {
                remote: true,
                filterable: true,
                value: status
              },
              on: {
                input: (value) => {
                  status = value
                }
              }
            }, [
                h('Option', {
                  props: {
                    value: '已签到',
                    label: '补签'
                  },
                }),
                h('Option', {
                  props: {
                    value: '迟到',
                    label: '迟到'
                  },
                }),
                h('Option', {
                  props: {
                    value: '请假',
                    label: '请假'
                  },
                })
              ])
          ])
        },
        onOk: () => {
          student.status = status
          // if (student.status === '迟到') {
          //   self.late += 1
          // } else if (student.status === '请假') {
          //   self.leave += 1
          // }
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
