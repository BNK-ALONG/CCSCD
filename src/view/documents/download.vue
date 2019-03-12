<template>
  <div>
    <Card title="本课程的文件下载量">
      <down-load :value="downloadList"
                 text="本课程的文件下载量"
                 style="height:500px;"></down-load>
    </Card>
    <Card title="本课程的提问热榜">
      <top-word :value="topWordList"
                text="本课程的提问热榜"
                style="height:500px;"></top-word>
    </Card>
    <Button type="success"
            @click="handleTest">测试专用</Button>
  </div>
</template>
<script>
import { DownLoad, TopWord } from '_c/charts'
import { downloadNumber } from '@/api/file'
import { getDuration } from '@/api/classCenter'
export default {
  name: 'download',
  components: {
    DownLoad,
    TopWord
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
      // topWordList: [
      //   { letter: '你好', frequency: 50 },
      //   { letter: '133', frequency: 15 },
      //   { letter: 'helou', frequency: 5 },
      //   { letter: '呵护你', frequency: 25 },
      //   { letter: '哈喽', frequency: 35 },
      //   { letter: '哈哈', frequency: 45 },
      //   { letter: '管理员', frequency: 15 },
      //   { letter: '姐姐', frequency: 50 },
      // ]
      topWordList: []
    }
  },
  mounted () {
    downloadNumber().then(res => res.status === 200 ? this.downloadList = res.send_data : this.$Message.error(res.message)).catch(err => console.log(err))
    getDuration().then(res => res.status === 200 ? this.topWordList = res.search_details : this.$Message.error(res.message)).catch(err => console.log(err))

  },
  methods: {
    handleTest () {
    }
  },
}
</script> 