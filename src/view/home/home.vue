<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12"
             :md="8"
             :lg="4"
             v-for="(infor, i) in inforCardData"
             :key="`infor-${i}`"
             style="height: 120px;padding-bottom: 10px;">
        <infor-card :color="infor.color"
                    :icon="infor.icon"
                    :icon-size="36"
                    @click.native="handleChangeRoute(i)">
          <count-to :end="infor.count"
                    :duration='3'
                    count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <data-vis style="margin-top:40px;"></data-vis>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import dataVis from './dataVis.vue'
import { mapActions } from 'vuex'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    dataVis
  },
  data () {
    return {
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      },
    }
  },
  computed: {
    classNumber () {
      return this.$store.state.app.classNumber
    },
    inforCardData () {
      let self = this
      const students = self.classNumber.students
      const sign = self.classNumber.sign
      const notices = self.classNumber.notices
      const questions = self.classNumber.questions
      const download = self.classNumber.download
      const files = self.classNumber.files
      return [
        { title: '学生人数', icon: 'md-person', count: students, color: '#2d8cf0' },
        { title: '累计发布签到', icon: 'md-pin', count: sign, color: '#19be6b' },
        { title: '学生提问', icon: 'md-help-circle', count: questions, color: '#ff9900' },
        { title: '累计发布公告', icon: 'ios-notifications', count: notices, color: '#ed3f14' },
        { title: '总下载量', icon: 'md-download', count: download, color: '#E46CBB' },
        { title: '文件总数', icon: 'ios-folder', count: files, color: '#9A66E4' }
      ]
    }

  },
  mounted () {
    this.getClassNumber()
  },
  methods: {
    ...mapActions([
      'getClassNumber'
    ]),
    handleChangeRoute (index) {
      switch (index) {
        case 0: this.$router.push({ name: 'student_info' })
          break;
        case 1: this.$router.push({ name: 'issue_sign' })
          break;
        case 2: this.$router.push({ name: 'wordCloud' })
          break;
        case 3: this.$router.push({ name: 'notice' })
          break;
        case 4:
          break;
        case 5: this.$router.push({ name: 'file_list' })
          break;
      }
    }
  },
}
</script>

<style lang="less">
.count-style {
  font-size: 60px;
}
</style>
