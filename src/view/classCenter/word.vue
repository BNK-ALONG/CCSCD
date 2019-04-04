<template>
  <div style="width:100%;height:100%;">
    <Row>
      <Col span='12'>
      <Card class="word-card"
            title="词云">
        <div ref="wordcloud"
             class="wordcloud"></div>
      </Card>
      </Col>
      <Col span='12'>
      <Card class="word-card"
            title="词云饼图">
        35163
      </Card>
      </Col>
    </Row>
  </div>

</template>
<script>
import { wordCloud } from '@/api/classCenter'
import Js2WordCloud from 'js2wordcloud'
import { ChartCate } from '_c/charts'
export default {
  name: 'wordCloud',
  components: {
    ChartCate
  },
  data () {
    return {
      timeoutId: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getWords()
    })
  },
  beforeRouteLeave (to, from, next) {
    clearTimeout(this.timeoutId)
    next()
  },
  methods: {
    getWords () {
      let self = this
      wordCloud().then(res => {
        if (res.status === 200) {
          self.renderCloud(res.search_details, 100, 30)
          self.timeoutId = setTimeout(() => {
            self.getWords()
          }, 3000)
        } else {
          self.$Message.error(res.message)
        }
      }).catch(error => {
        self.$Message.error(error)
      })
    },
    renderCloud (words, maxFontSize, minFontSize) {
      let list = []
      for (let item of words) {
        let arr = []
        arr.push(item.letter)
        arr.push(item.frequency)
        list.push(arr)
      }
      let option = {
        fontFamily: 'STKaiti', //字体
        maxFontSize: maxFontSize,                                        // 最大fontSize，用来控制weightFactor，默认60
        minFontSize: minFontSize,
        tooltip: {
          show: true,
          backgroundColor: 'rgb(255, 255, 255, 0.9)',
          formatter: function (item) {
            return '关键词：' + item[0] + '<br>' + '次数' + item[1]
          }
        },
        list: list,
        ellipticity: 1,
        minRotation: 0.5,
        maxRotation: 1,
        cardioid: 'star',
        color: function () {
          return 'rgb(' + [
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160)
          ].join(',') + ')';
        }
      }
      let wc = new Js2WordCloud(this.$refs.wordcloud)
      wc.setOption(option)
      window.onresize = function () {
        wc.resize()
      }
    },
  }
}
</script>
<style>
.word-card {
  height: 300px;
  overflow: hidden;
}
.wordcloud {
  height: 100%;
  width: 100%;
}
</style>
