<template>
  <div ref="dom"
       class="charts chart-TopWord"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'TopWord',
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
          dimensions: ['letter', 'frequency'],
          source: this.value
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '20%'
        },
        xAxis: {
          type: 'category',
          nameTextStyle: {
            color: '#000',
            fontStyle: 'italic',
            fontSize: 18,
            align: 'right',
          }
        },
        yAxis: {
          type: 'value',
          max: (value) => {
            return value.max + value.max / 10
          }

        },
        series: [
          {
            name: '提问次数',
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
