<template>
  <div>
    <Steps direction="vertical">
      <Step v-for="(chapter,index) in hasChapterList"
            :key="`notChapter_${index}`"
            status="finish">
        <p slot="title">第{{index+1}}讲——{{chapter.title}}</p>
        <Card slot="content">
          <div slot="extra">
            <p>已上课</p>
            <Tooltip content="删除本节"
                     style="width:auto;">
              <Button type="text"
                      @click="handleDelChapter('已上课',chapter.lesson_id,chapter.index)">
                <CommonIcon :size="24"
                            color="#999"
                            type="_lajitong1 delete-btn" />
              </Button>
            </Tooltip>
          </div>
          <p>日期：{{chapter.date}}</p>
          <p>上课时间：{{chapter.start_time}}——{{chapter.end_time}}</p>
          <p>本节内容：
            <Tag v-for="(tag,index) in chapter.brief"
                 :key="index">{{tag}}</Tag>
          </p>
          <play-ppt :classFileList="chapter.files"></play-ppt>
        </Card>
      </Step>

      <Step v-for="(chapter,index) in notChapterList"
            :key="`notChapter${index}`"
            :status="index===0?'process':'wait'">
        <p slot="title">第{{hasChapterList.length+index+1}}讲——{{chapter.title}} </p>
        <Card slot="content">
          <div slot="extra">
            <p>未上课</p>
            <Tooltip content="删除本节"
                     style="width:auto;">
              <Button type="text"
                      @click="handleDelChapter('未上课',chapter.lesson_id,chapter.index)">
                <CommonIcon :size="24"
                            type="_lajitong1" />
              </Button>
            </Tooltip>
          </div>
          <p>本节内容：
            <Tag v-for="(hasTag,index) in chapter.brief"
                 :color="index<4?tagColor[index]:tagColor[index%3-1]"
                 :key="index">{{hasTag?hasTag:'空'}}</Tag>
          </p>
          <play-ppt :classFileList="chapter.files"></play-ppt>
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
import { getChapters, deleteChapter, addChapter } from '@/api/classCenter'
import CommonIcon from '_c/common-icon'

import { ShareOrImport } from '@/api/file'
import PlayPpt from './playPpt.vue'
import AddChapter from './addChapter.vue'
export default {
  name: 'chapter',
  components: {
    PlayPpt,
    AddChapter,
    CommonIcon
  },
  data () {
    return {
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
              },
              "get-tag-value": (val) => {
                brief = val
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
          if (lesson_id && lesson_id !== 'false') {
            this.notChapterList.push({
              title: title,
              brief: brief,
              files: files,
              lesson_id: lesson_id
            })
          } else if (lesson_id === 'false') {
            this.$Message.error('添加失败，服务器出现故障。')
          }
          else {
            let data = {
              title: title,
              brief: brief
            }
            addChapter({
              data: data
            }).then(res => {
              if (res.status === 200) {
                this.notChapterList.push({
                  title: title,
                  brief: brief,
                  files: []
                })
                this.$Message.success('添加成功！')
              } else {
                this.$Message.error('添加失败！')
              }
            }).catch(err => console.log(err))
          }
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
    },
    // 删除一节课
    handleDelChapter (type, lesson_id, index) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '删除本节之后，数据不可恢复，请三思而后行。',
        okText: '删除',
        onOk: () => {
          deleteChapter({ lesson_id: lesson_id }).then(res => {
            if (res.status === 200) {
              if (type === '已上课') {
                this.hasChapterList.splice(index, 1)
              } else {
                this.notChapterList.splice(index, 1)
              }
              this.$Message.success('删除成功！')
            } else {
              this.$Message.error(res.message)
            }
          }).catch(err => console.log(err))
        }
      })
    },
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
.delete-btn:hover::before {
  color: #2d8cf0 !important;
}
</style>
