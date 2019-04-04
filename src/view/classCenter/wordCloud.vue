<template>

  <Card title="提问词云">
    <div class="chart"
         ref="pageView"></div>
  </Card>
</template>

<script>
import echarts from "echarts";
require('echarts-wordcloud');
require("echarts/theme/roma"); // echarts theme
let _ = require("underscore");
export default {
  props: {
    data: {
      type: Array,
      default: () => [{
        name: '反馈很快',
        value: 1000,
        textStyle: {
          normal: {
            color: 'black'
          },
          emphasis: {
            color: 'red'
          }
        }
      }, {
        name: '态度很好',
        value: 611
      }, {
        name: '提前预约',
        value: 436
      }, {
        name: '及时沟通',
        value: 455
      }, {
        name: '技术不好',
        value: 247
      }, {
        name: '效果不佳',
        value: 224
      }, {
        name: '和预期相同',
        value: 188
      }, {
        name: '返工',
        value: 144
      }, {
        name: '很满意',
        value: 112
      }, {
        name: '来的很及时',
        value: 95
      }, {
        name: '操作规范',
        value: 87
      }, {
        name: '安排及时',
        value: 52
      }, {
        name: '投诉无用',
        value: 55
      }, {
        name: '业务水平高',
        value: 50
      }, {
        name: '完成的不错',
        value: 46
      }, {
        name: '我觉得还行',
        value: 36
      }, {
        name: '还行',
        value: 36
      }, {
        name: 'Serena Williams',
        value: 28
      }, {
        name: 'NCAA baseball tournament',
        value: 27
      }, {
        name: 'Point Break',
        value: 26
      }]
    }
  },
  data () {
    return {
      chart: null,
      autoResize: true
    };
  },
  mounted () {
    this.initChart();
    if (this.autoResize) {
      this.__resizeHanlder = _.debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHanlder);
    }
  },

  methods: {
    setOptions ({ expectedData, actualData } = {}) {
      this.chart.setOption({
        tooltip: {},
        series: [{
          type: 'wordCloud',
          rotationRange: [0, 0],
          shape: 'circle',
          textStyle: {
            normal: {
              color: function () {
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',') + ')';
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: this.data
        }],
        animationDuration: 2800,
        animationEasing: "cubicInOut"
      });
    },
    initChart () {
      this.chart = echarts.init(this.$refs.pageView, "roma");
      this.setOptions(this.chartData);
    }
  }
};
</script>
<style>
.chart {
  width: 100%;
  height: 250px;
}
</style>


