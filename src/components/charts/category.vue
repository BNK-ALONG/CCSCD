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
      const self = this
      self.dom = echarts.init(self.$refs.dom, 'tdTheme')
      self.dom.setOption(self.option)
      on(window, 'resize', self.resize)
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
    const self = this
    off(window, 'resize', self.resize)
  }
}
</script>
