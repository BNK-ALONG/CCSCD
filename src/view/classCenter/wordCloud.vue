<template>
  <div style="width:100%;height:100%;">
    <!-- <Card style="width:100%;height:100%;"> -->
    <div id="wordcloud"></div>
    <!-- </Card> -->

  </div>

</template>
<script>
import { wordCloud } from '@/api/classCenter'
import Js2WordCloud from 'js2wordcloud'
export default {
  name: 'wordCloud',
  data () {
    return {
      timeoutId: ''
    }
  },
  created () {
    this.getWords()
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
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          formatter: function (item) {
            return '关键词：' + item[0] + '<br>' + '次数' + item[1]
          }
        },
        list: list,
        ellipticity: 1,
        minRotation: 0.5,
        maxRotation: 1,
        cardioid: 'star',
        backgroundColor: ' #353840',
        color: (word, weight, fontSize, distance, theta) => {
          const dist = (maxFontSize - minFontSize) / 2
          console.log('word:', word, 'weight:', weight, 'fontSize:', fontSize, 'distance:', distance, 'theta:', theta)
          if (fontSize === maxFontSize) {
            return '#F44336'
            // return '#EF8F88'

          } else if (fontSize > minFontSize + dist && fontSize < minFontSize + 2 * dist) {
            return '#00ACC1'
            // return '#6F91B5'

          } else if (fontSize > minFontSize && fontSize <= minFontSize + dist) {
            return '#4CAF50'
            // return '#B7E1E4'

          }
          else if (fontSize === minFontSize) {
            return 'rgb(161, 177, 171)'
            // return '#89C0B7'

          }
        }
      }
      console.log(list);
      let wc = new Js2WordCloud(document.getElementById('wordcloud'))
      wc.setOption(option)
      window.onresize = function () {
        wc.resize()
      }
    },
  }
}
</script>
<style scoped>
#wordcloud {
  width: 100%;
  height: 100%;
}
</style>
