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
    option: {
      type: Object,
      default: () => { }
    }
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

      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(this.option)
      on(window, 'resize', this.resize)
    }
  },
  mounted () {
    this.initEcharts()
  },
  watch: {
    option () {
      this.$nextTick(() => {
        if (this.option) {
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
