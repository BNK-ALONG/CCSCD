<template>
  <Steps :current="chapterList.length-1"
         direction="vertical">

    <Step v-for="(chapter,index) in chapterList"
          :key="index">
      <p slot="title">第{{index+1}}讲——{{chapter.title}}</p>
      <Card slot="content">
        <p>日期：{{chapter.date}}</p>
        <p>上课时间：{{chapter.start_time}}——{{chapter.end_time}}</p>
        <p>本节内容：{{chapter.brief}}</p>
        <play-ppt :classFileList="chapter.files"></play-ppt>
      </Card>
    </Step>
  </Steps>
</template>
<script>
import { getChapters } from '@/api/classCenter'
import { ShareOrImport } from '@/api/file'
import PlayPpt from './playPpt.vue'
export default {
  components: {
    PlayPpt
  },
  data () {
    return {
      chapterList: [
        {
          title: '认识javascript',
          brief: '由于网景公司希望能在静态HTML页面上添加一些动态效果，于是叫Brendan Eich这哥们在两周之内设计出了JavaScript语言。你没看错，这哥们只用了10天时间。',
          date: '2019-03-28',
          start_time: '09:00',
          end_time: '09:45',
          files: [
            {
              file_name: '文件名',
              file_name_uuid: 'c20d14ee.pdf',
              ShareStatus: 0,
              extension: 'pdf'
            },
            {
              file_name: '文件名',
              file_name_uuid: 'c20d14ee.pdf',
              ShareStatus: 0,
              extension: 'pdf'
            }
          ]
        },
        {
          title: '基础类型',
          brief: '这是课程简介',

          date: '2019-03-28',
          start_time: '09:00',
          end_time: '09:45',
          files: [
            {
              file_name: '文件名',
              file_name_uuid: 'c20d14ee.pdf',
              ShareStatus: 0,
              extension: 'pdf'
            },
            {
              file_name: '文件名',
              file_name_uuid: 'c20d14ee.pdf',
              ShareStatus: 0,
              extension: 'pdf'
            }
          ]
        },
        {
          title: '认识javascript',
          brief: '这是课程简介',
          date: '2019-03-28',
          start_time: '09:00',
          end_time: '09:45',
          files: [
            {
              file_name: '文件名',
              file_name_uuid: 'c20d14ee.pdf',
              ShareStatus: 0,
              extension: 'pdf'
            },
            {
              file_name: '文件名',
              file_name_uuid: 'c20d14ee.pdf',
              ShareStatus: 0,
              extension: 'pdf'
            }
          ]
        },
      ]
    }
  },
  mounted () {
    getChapters().then(res => {
      if (res) {
        this.chapterList = res
      }
    }).catch(err => this.$Message.error(err))
  },
  methods: {

  },
}
</script>