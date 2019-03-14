<template>
  <div ref="dom"
       class="charts chart-download"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'DownLoad',
  props: {
    value: Array,
    text: String
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
      let option = {
        title: {
          text: this.text,
          x: 'center'
        },
        dataset: {
          dimensions: ['file_name', 'download_num'],
          source: this.value
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '20%'
        },
        xAxis: {
          name: '下载量',
          type: 'value',
          max: (value) => {
            return value.max + value.max / 10
          }
        },
        yAxis: {
          name: '文件名',
          type: 'category',
          nameTextStyle: {
            color: '#000',
            fontStyle: 'italic',
            fontSize: 18,
            align: 'right',
          }
        },
        series: [
          {
            name: '总下载量',
            type: 'bar'
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
  },
  mounted () {
    this.initEcharts()
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
    off(window, 'resize', this.resize)
  }
}
</script>
