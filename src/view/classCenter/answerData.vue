<template>
  <div style="height:100%;width:100%;"
       ref="contentHeight">
    <Row :gutter="20">
      <i-col span="12">
        <word-cloud :wordData="data"></word-cloud>
      </i-col>
      <i-col span="12">
        <Card title="进度提醒">
          <Row style="height:250px;"
               type="flex"
               justify="center">
            <i-col span="8">
              <i-circle :stroke-color="strokeColor"
                        :percent="100"
                        :size="180">
                <div v-if="strokeColor==='#5cb85c'">
                  <span class="circle-num">{{attention.num}}</span>
                </div>
                <div v-else>
                  <Icon type="ios-close"
                        size="90"
                        style="color:#ff5500"></Icon>
                  <p class="prompt-p">进度过快！</p>
                </div>
              </i-circle>
            </i-col>
            <i-col span="8">
              <div style="margin: 45% 0px;">
                <p class="prompt-p">
                  关键词：{{attention.key_word}}
                </p>
                <p class="prompt-p">辅助词：{{attention.assist_word}}</p>
              </div>
            </i-col>
          </Row>
        </Card>
      </i-col>
    </Row>
    <answer-bar :option="wordsOption"></answer-bar>
  </div>
</template>
<script>
import wordCloud from './wordCloud.vue'
import AnswerBar from './answerBar.vue'
import { getWordsOption } from '@/libs/util'
import { topWord, noteMessage } from '@/api/classCenter'
import { getWordsCloud } from '@/api/classCenter'

export default {
  components: {
    wordCloud,
    AnswerBar
  },
  data () {
    return {
      topWordList: [
        { time: '1977', letter1: '管理学', letter2: 'aa', letter3: 'a', frequency1: 16, frequency2: 5, frequency3: 3 },
        { time: '1978', letter1: 'ha', letter2: 'aa', letter3: 'a', frequency1: 6, frequency2: 5, frequency3: 3 },
        { time: '1979', letter1: 'ha', letter2: 'aa', letter3: 'a', frequency1: 6, frequency2: 5, frequency3: 3 },
        { time: '1981', letter1: 'ha', letter2: 'aa', letter3: 'a', frequency1: 6, frequency2: 5, frequency3: 3 },
        { time: '1983', letter1: 'ha', letter2: 'aa', letter3: 'a', frequency1: 6, frequency2: 5, frequency3: 3 },
        { time: '1988', letter1: 'ga', letter2: 'e', letter3: 'h', frequency1: 6, frequency2: 5, frequency3: 3 }
      ],
      strokeColor: '#5cb85c',
      attention: {},
      data: []
    }
  },
  computed: {
    // 提问热榜柱状图的配置项
    wordsOption () {
      const option = getWordsOption(this.topWordList)
      return option
    }
  },
  created () {
    topWord().then(res => res.status === 200 ? this.topWordList = res.search_details : this.$Message.error(res.message)).catch(err => console.log(err))
  },
  activated () {
    topWord().then(res => res.status === 200 ? this.topWordList = res.search_details : this.$Message.error(res.message)).catch(err => console.log(err))
  },
  mounted () {
    let self = this

    noteMessage().then(res => {
      if (res.status === 200) {
        self.attention = res.attention
        if (res.attention.the_status !== 200) {
          self.strokeColor = '#ff5500'
        }
      } else {
        self.$Message.error(res.message)
      }
    }).catch(err => self.$Message.error(err))
    getWordsCloud().then(res => {
      if (res.status === 200) {
        self.data = res.search_details
        self.data[0].textStyle = {
          normal: {
            color: 'red'
          },
          emphasis: {
            color: 'black'
          }
        }
      } else {
        self.$Message.error(res.message)
      }
    }).catch(error => {
      self.$Message.error(error)
    })
  },
}
</script>
<style lang="less">
.circle-num {
  font-size: 24px;
}
.prompt-p {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
</style>