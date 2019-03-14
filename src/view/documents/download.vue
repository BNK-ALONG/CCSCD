<template>
  <div>
    <Card title="本课程的文件下载量">
      <down-load :value="downloadList"
                 text="本课程的文件下载量"
                 style="height:500px;"></down-load>
    </Card>
    <Card title="本课程的提问热榜">

      <chart-cate :option="getOption"
                  style="height: 350px;width:100%;"></chart-cate>
    </Card>
    <Button type="success"
            @click="handleTest">测试专用</Button>
  </div>
</template>
<script>
import { DownLoad, TopWord, ChartCate } from '_c/charts'
import { downloadNumber } from '@/api/file'
import { getDuration, topWord } from '@/api/classCenter'
export default {
  name: 'download',
  components: {
    DownLoad,
    TopWord,
    ChartCate
  },
  data () {
    return {
      // downloadList: [
      //   { file_name: "JavaScript-二维码", download_num: 10 },
      //   { file_name: "Unit 7 Superstition", download_num: 5 },
      //   { file_name: "联合王国、大不列颠与英格兰之间的区别-国旗展示", download_num: 20 },
      //   { file_name: "03管理学院2017版培养方案", download_num: 3 },
      //   { file_name: "Unit 2 General Facts of UK", download_num: 12 },
      //   { file_name: "西方文化期末考试范围和题型", download_num: 10 },
      //   { file_name: "students", download_num: 14 }
      // ]
      downloadList: [],
      topWordList: [
        { time: '1977', letter1: '管理学', letter2: 'aa', letter3: 'a', frequency1: 16, frequency2: 5, frequency3: 3 },
        { time: '1978', letter1: 'ha', letter2: 'aa', letter3: 'a', frequency1: 6, frequency2: 5, frequency3: 3 },
        { time: '1979', letter1: 'ha', letter2: 'aa', letter3: 'a', frequency1: 6, frequency2: 5, frequency3: 3 },
        { time: '1981', letter1: 'ha', letter2: 'aa', letter3: 'a', frequency1: 6, frequency2: 5, frequency3: 3 },
        { time: '1983', letter1: 'ha', letter2: 'aa', letter3: 'a', frequency1: 6, frequency2: 5, frequency3: 3 },
        { time: '1988', letter1: 'ga', letter2: 'e', letter3: 'h', frequency1: 6, frequency2: 5, frequency3: 3 }
      ]
    }
  },
  computed: {
    getOption () {
      return {
        legend: {},
        title: { text: '本课程的提问热榜', x: 'center' },
        tooltip: {
          formatter: function (params, ticket, callback) {
            let color = params.color
            let seriesIndex = params.seriesIndex
            let showHtml
            switch (seriesIndex) {
              case 0:
                showHtml = params.data.time + '<br>' + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + color + ';"></span>' + params.data.letter1 + '：' + params.data.frequency1 + '次'
                break;
              case 1:
                showHtml = params.data.time + '<br>' + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + color + ';"></span>' + params.data.letter2 + '：' + params.data.frequency2 + '次'

                break;
              case 2:
                showHtml = params.data.time + '<br>' + '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + color + ';"></span>' + params.data.letter3 + '：' + params.data.frequency3 + '次'
                break;
            }
            return showHtml
          }
        },
        dataset: {
          dimensions: ['time', 'letter1', 'letter2', 'letter3', 'frequency1', 'frequency2', 'frequency3'],
          source: this.topWordList
        },
        xAxis: { name: '时间', type: 'category' },
        yAxis: {          name: '提问量',
          max: (value) => {
            return value.max + value.max / 4
          }        },

        series: [
          {
            type: 'bar',
            dimensions: ['time', 'letter1', 'letter2', 'letter3', 'frequency1', 'frequency2', 'frequency3'],

            encode: {

              x: 'time',
              y: ['frequency1']
            },
            label: {
              show: true,
              formatter: '{@letter1}',
              position: 'top'
            }
          },
          {
            type: 'bar',
            encode: {
              x: 'time',
              y: ['frequency2']
            },
            label: {
              show: true,
              formatter: '{@letter2}',
              position: 'top'
            }
          },
          {
            type: 'bar',
            encode: {
              x: 'time',
              y: ['frequency3']
            },
            label: {
              show: true,
              formatter: '{@letter3}',
              position: 'top'
            }
          }
        ]

      }
    },
  },
  mounted () {
    downloadNumber().then(res => res.status === 200 ? this.downloadList = res.send_data : this.$Message.error(res.message)).catch(err => console.log(err))
    topWord().then(res => res.status === 200 ? console.log(res.search_details) : this.$Message.error(res.message)).catch(err => console.log(err))
  },
  methods: {
    handleTest () {
      console.log(this.getOption)
    }
  },
}
</script> 