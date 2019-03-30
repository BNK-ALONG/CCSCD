<template>
  <div>
    <Steps direction="vertical">
      <Step v-for="(chapter,index) in hasChapterList"
            :key="`notChapter_${index}`"
            status="finish">
        <p slot="title">第{{index+1}}讲——{{chapter.title}}</p>
        <Card slot="content">
          <p slot="extra">已上课</p>
          <p>日期：{{chapter.date}}</p>
          <p>上课时间：{{chapter.start_time}}——{{chapter.end_time}}</p>
          <p>本节内容：
            <Tag v-for="(tag,index) in chapter.brief"
                 :key="index">{{tag}}</Tag>
          </p>
          <play-ppt :classFileList="chapter.files"></play-ppt>
        </Card>
      </Step>

      <Step v-for="(notChapter,index) in notChapterList"
            :key="`notChapter${index}`"
            :status="index===0?'process':'wait'">
        <p slot="title">第{{hasChapterList.length+index+1}}讲——{{notChapter.title}}</p>
        <Card slot="content">
          <p slot="extra">未上课</p>
          <p>本节内容：
            <Tag v-for="(hasTag,index) in notChapter.brief"
                 :color="index<4?tagColor[index]:tagColor[index%3-1]"
                 :key="index">{{hasTag?hasTag:'空'}}</Tag>
          </p>
          <play-ppt :classFileList="notChapter.files"></play-ppt>
        </Card>
      </Step>

    </Steps>
    <Steps>
      <Step status="process"
            icon="md-add-circle my-add">
        <Button slot="title"
                type="primary"
                long
                ghost
                @click="handleAddChapter"
                icon="md-add">添加一节课</Button>
      </Step>
    </Steps>

  </div>
</template>
<script>
import { getChapters, deleteChapter } from '@/api/classCenter'
import { ShareOrImport } from '@/api/file'
import PlayPpt from './playPpt.vue'
import AddChapter from './addChapter.vue'
export default {
  name: 'chapter',
  components: {
    PlayPpt,
    AddChapter
  },
  data () {
    return {
      // notChapterList: [
      //   {
      //     title: '认识javascript',
      //     brief: ['管理学', '数据结构', '入门'],
      //     date: '2019-03-28',
      //     start_time: '09:00',
      //     end_time: '09:45',
      //     files: [
      //       {
      //         file_name: '文件名',
      //         file_name_uuid: 'c20d14ee.pdf',
      //         ShareStatus: 0,
      //         extension: 'pdf'
      //       },
      //       {
      //         file_name: '文件名',
      //         file_name_uuid: 'c20d14ee.pdf',
      //         ShareStatus: 0,
      //         extension: 'pdf'
      //       }
      //     ]
      //   },
      //   {
      //     title: '基础类型',
      //     brief: ['管理学', '数据结构', '入门'],
      //     date: '2019-03-28',
      //     start_time: '09:00',
      //     end_time: '09:45',
      //     files: [
      //       {
      //         file_name: '文件名',
      //         file_name_uuid: 'c20d14ee.pdf',
      //         ShareStatus: 0,
      //         extension: 'pdf'
      //       },
      //       {
      //         file_name: '文件名',
      //         file_name_uuid: 'c20d14ee.pdf',
      //         ShareStatus: 0,
      //         extension: 'pdf'
      //       }
      //     ]
      //   },
      //   {
      //     title: '认识javascript',
      //     brief: ['管理学', '数据结构', '入门'],
      //     date: '2019-03-28',
      //     start_time: '09:00',
      //     end_time: '09:45',
      //     files: [
      //       {
      //         file_name: '文件名',
      //         file_name_uuid: 'c20d14ee.pdf',
      //         ShareStatus: 0,
      //         extension: 'pdf'
      //       },
      //       {
      //         file_name: '文件名',
      //         file_name_uuid: 'c20d14ee.pdf',
      //         ShareStatus: 0,
      //         extension: 'pdf'
      //       }
      //     ]
      //   },
      // ],
      // hasChapterList: [
      //   {
      //     title: 'javascript进阶',
      //     brief: ['管理学', '数据结构', '入门'],
      //     files: [
      //       {
      //         file_name: 'javascript进阶',
      //         file_name_uuid: 'c20d14ee.pdf',
      //         ShareStatus: 0,
      //         extension: 'pdf'
      //       },
      //       {
      //         file_name: 'javascript进阶',
      //         file_name_uuid: 'c20d14ee.pdf',
      //         ShareStatus: 0,
      //         extension: 'pdf'
      //       }
      //     ]
      //   },
      // ],
      notChapterList: [],
      hasChapterList: [],
      tagColor: ['geekblue', 'green', 'orange', 'red']

    }
  },
  mounted () {
    getChapters().then(res => {
      if (res.status === 200) {
        this.notChapterList = res.raw_data
        this.hasChapterList = res.history_data
      } else {
        this.$Message.error(res.message)
      }
    }).catch(err => console.log(err))
  },
  methods: {
    //添加一节课的对话框
    handleAddChapter () {
      let brief, title, files, lesson_id
      this.$Modal.confirm({
        title: '添加课程章节',
        render: (h) => {
          return h(AddChapter, {
            props: {},
            on: {
              "on-title-change": (val) => {
                title = val
                console.log(title)
              },
              "get-tag-value": (val) => {
                brief = val
                console.log(brief)

              },
              "on-change-files": (val) => {
                files = val

              },
              "get-lessonId": (val) => {
                lesson_id = val
              }
            }
          })
        },
        onOk: () => {
          this.hasChapterList.push({
            title: title,
            brief: brief,
            files: files
          })
        },
        //关闭添加课程章节对话框，假如创建课堂成功的则进行删除
        onCancel: () => {
          if (lesson_id) {
            deleteChapter({
              lesson_id: lesson_id
            }).then().catch(err => console.log(err))
          } else {
            return
          }
        }
      })
    }
  },
}
</script>
<style >
.my-add {
  font-size: 2.5em !important;
  top: 0px;
  width: auto !important;
  height: auto !important;
  left: 0 !important;
}
</style>
