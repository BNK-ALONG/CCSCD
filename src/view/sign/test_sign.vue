<template>
  <div>
    <Card>
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
                 @on-close="handleChangeSign(left.itemLeft,left.index)">{{ left.itemLeft.stuid }} {{ left.itemLeft.stuname }}
            <div slot="close">修改
              <Icon type="md-return-right" />
            </div>
          </Alert>
          <h3 slot="right-title">已签到:{{list2.length}} 人</h3>
          <!-- <Card class="drag-item"
                slot="right"
                slot-scope="right">{{right.itemRight.stuid }} {{ right.itemRight.stuname }}</Card> -->
          <Alert slot="right"
                 slot-scope="right"
                 type="success"
                 show-icon>{{right.itemRight.stuid }} {{ right.itemRight.stuname }}
          </Alert>
        </drag-list>
      </div>

      <Row :gutter="20"
           style="margin-top: 10px;">
        <i-col :md="24"
               :lg="8"
               style="margin-bottom: 20px;">
          <Card shadow>
            <chart-pie style="height: 300px;"
                       :value="pieData"
                       text="当前签到情况"></chart-pie>
          </Card>
        </i-col>
        <i-col :md="24"
               :lg="16"
               style="margin-bottom: 20px;">
          <keep-alive>
            <time-down :setTimer='timeDown'
                       color="rgb(45, 183, 245)"></time-down>
          </keep-alive>
        </i-col>
      </Row>
      <Button type="success"
              @click="handleGetNowSignRecord">测试专用</Button>
    </Card>
  </div>
</template>
<script>
import DragList from '_c/drag-list'
import timeDown from '_c/timeDown'
import { allSignRecord, newSignRecord, updateSignRecord, nowSignRecord } from '@/api/sign'
import { ChartPie, ChartBar } from '_c/charts'
export default {
  name: 'record_sign',
  components: {
    DragList,
    ChartPie,
    timeDown
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
      timeoutID: '',
      signRemark: '补签',
      late: 0,
      leave: 0,
      // setTimer: 300000
    }
  },
  mounted () {
    nowSignRecord().then(res => {
      if (res.status === 200) {
        this.list1 = res.unsigned_record
        this.list2 = res.signed_record
      } else {
        this.$Message.error(res.message)
      }
    }).catch(err => console.log(err))
  },
  computed: {
    setTimer () {
      return this.$store.state.sign.timeDown * 60 * 1000
    },
    unSignLength () {
      return this.list1.length
    },
    signedLength () {
      return this.list2.length - this.late - this.leave
    },
    pieData () {
      return [
        { value: this.signedLength, name: '已签到' },
        { value: this.late, name: '迟到' },
        { value: this.leave, name: '请假' },
        { value: this.unSignLength, name: '未签到' }
      ]    },
  },
  methods: {
    // 两个列表的变化
    handleChange ({ oldIndex, newIndex }) {
      this.signRemarkModal(this.list2[newIndex], 'drag', newIndex, oldIndex)
    },
    // 获取全部签到情况的表格
    handleAllSignRecord () {
      allSignRecord().then(res => {
        console.log(res)
      }).catch(err => {
        this.$Modal.error({
          title: '获取全部的签到情况表失败！请联系管理员。',
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
          console.log('学号：', student.stuid)
          console.log('姓名：', student.stuname)
          console.log('姓名：', student.status)
          if (student.status === '迟到') {
            self.late += 1
          } else if (student.status === '请假') {
            self.leave += 1
          }
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
    // 获取当前签到情况
    handleGetNowSignRecord () {
      console.log(this.pieData)
    },

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
  .right-drop-box {
    //
  }
}
</style>
