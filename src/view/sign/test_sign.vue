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
            <time-down :setTimer='setTimer'
                       color="rgb(45, 183, 245)"></time-down>
          </keep-alive>
        </i-col>
      </Row>
      <Row>
        <chart-cate style="height: 350px;width:100%;"
                    :option="getOption"></chart-cate>
      </Row>

      <Button type="success"
              @click="handleTest">测试专用</Button>
    </Card>
  </div>
</template>
<script>
import DragList from '_c/drag-list'
import timeDown from '_c/timeDown'
import { allSignRecord, newSignRecord, updateSignRecord, nowSignRecord, allLocatedRecord } from '@/api/sign'
import { ChartPie, ChartCate } from '_c/charts'
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
      timeoutID: '',
      signRemark: '补签',
      late: 0,
      leave: 0,
      allSignList: [],
      websock: null,
    }
  },
  created () {
    //页面刚进入时开启长连接
    this.initWebSocket()
    this.websock.onmessage()
  },
  destroyed: function () {
    //页面销毁时关闭长连接
    this.websocketclose();
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
    allLocatedRecord().then(res => res.status === 200 ? this.allSignList = res.all_record_data : console.log(res.message)).catch(err => console.log(err))
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
      ]
    },
    getOption () {
      return {
        animation: true,
        dataset: {
          dimensions: ['sign_time', 'signed_num', 'unsigned_num'],
          source: this.allSignList
        },
        title: {
          text: "历史签到记录情况"
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
          // bottom: '15%',
          containLabel: true,
          // backgroundColor: '#F3F3F3',
          // borderColor: '#474747'
        },
        // 图表的工具栏
        toolbox: {
          show: true,
          feature: {
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
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
          type: 'category',
          boundaryGap: false,
          //网格样式
          // splitLine: {
          //   show: true,
          //   lineStyle: {
          //     color: '#C8C8C8',
          //     width: 1,
          //   }
          // }
        },
        yAxis: {
          type: 'value',
        },
        series: [
          { name: '已签到', type: 'line', color: '#19BE6B' },
          { name: '未签到', type: 'line', color: '#ED4014' }
        ]
      }
    },
  },
  methods: {

    // 测试专用方法
    handleTest () {
      // 
    },

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


    initWebSocket () { //初始化weosocket 
      if ("WebSocket" in window) {
        const WS_API = 'wss://www.psycollege.com.cn'
        const wsuri = WS_API + "/sign/changed_located_records"//ws地址
        this.websock = new WebSocket(wsuri)
        console.log(this.websock)
        this.websock.onmessage = (evt) => {
          // var received_msg = evt;
          console.log(JSON.stringify(evt))
          // alert("数据已接收...");
        };

        // this.websock.onmessage = this.websocketonmessage();
        // this.websock.onclose = this.websocketclose();
      } else {
        alert("您的浏览器不支持 WebSocket!");
      }

    },

    websocketonopen () {
      console.log("WebSocket连接成功");
    },
    websocketonerror (e) { //错误
      console.log("WebSocket连接发生错误");
    },
    websocketonmessage (e) { //数据接收 
      console.log(e)
      const redata = JSON.parse(e.data);
      //注意：长连接我们是后台直接1秒推送一条数据， 
      //但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
      //这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
      // console.log(redata);
    },

    websocketsend (agentData) {//数据发送 
      this.websock.send(agentData);
    },

    websocketclose (e) { //关闭 
      console.log("connection closed (" + e.code + ")");
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
