<template>
  <div ref="dom"
       class="charts chart-pie"></div>
</template>

<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
// 引入饼图
require('echarts/lib/chart/pie');
// 引入提示框
require('echarts/lib/component/tooltip');
// 标题组件
require('echarts/lib/component/title');
// 图列 说明
require('echarts/lib/component/legend');
// 区域缩放
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  props: {
    value: Array,
    text: String,
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    initEcharts () {
      const self = this
      let option = {
        title: {
          text: self.text,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>人数 : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: self.value.map(_ => _.name)
        },
        series: [
          {
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: self.value,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      self.dom = echarts.init(self.$refs.dom, 'tdTheme')
      self.dom.setOption(option)
      on(window, 'resize', self.resize)
    }
  },

  watch: {
    value () {
      this.$nextTick(() => {
        if (this.value) {
          this.initEcharts()
        }
      });
    }
  },
  beforeDestroy () {
    const self = this
    off(window, 'resize', self.resize)
  }
}
</script>
