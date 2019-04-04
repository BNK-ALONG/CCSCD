<template>
  <div ref="dom"
       class="charts chart-category"></div>
</template>

<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入折线图
require('echarts/lib/chart/line');
// 引入饼图
require('echarts/lib/chart/pie');
// 引入提示框
require('echarts/lib/component/tooltip');
// 标题组件
require('echarts/lib/component/title');
// 图列 说明
require('echarts/lib/component/legend');
// 区域缩放
require('echarts/lib/component/dataZoom');
// 数据集
require('echarts/lib/component/dataset');
// 网格
require('echarts/lib/component/grid');
require('echarts-wordcloud');
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
