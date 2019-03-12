<template>
  <div ref="dom"
       class="charts chart-category"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartCate',
  props: {
    allSignList: Array,
    text: String
  },
  data () {
    return {
      dom: null,

    }
  },

  methods: {
    resize () {
      this.dom.resize()
    },
    initEcharts () {
      // let legend = this.value.map(_ => _.name)
      let option = {
        animation: true,
        dataset: {
          dimensions: ['sign_time', 'signed_num', 'unsigned_num'],
          source: this.allSignList
        },
        title: {
          text: this.text
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
          //网格样式
          // splitLine: {
          //   show: true,
          //   lineStyle: {
          //     color: '#C8C8C8',
          //     width: 1,
          //   }
          // }
        },
        series: [
          { name: '已签到', type: 'line', color: '#19BE6B' },
          { name: '未签到', type: 'line', color: '#ED4014' }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
  },
  watch: {
    allSignList () {
      this.$nextTick(() => {
        if (this.allSignList) {
          this.initEcharts()
        }
      });
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
