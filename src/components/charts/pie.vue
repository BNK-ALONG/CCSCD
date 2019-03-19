<template>
  <div ref="dom"
       class="charts chart-pie"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartPie',
  props: {
    value: Array,
    text: String,
    subtext: String
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
      let legend = self.value.map(_ => _.name)
      let option = {
        title: {
          text: self.text,
          subtext: self.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>人数 : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: legend
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
  // mounted () {
  //   this.initEcharts()
  // },
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
