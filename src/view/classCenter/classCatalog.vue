<template>
  <div>
    <Row :gutter="30">
      <i-col span="19">
        <div class="chapter-wrap">
          <Steps direction="vertical">
            <!-- 已上课列表 -->
            <Step v-for="(chapter,index) in hasChapterList"
                  :key="`hasChapter_${index}`"
                  status="finish"
                  :id="`HAS_CHAPTER_${index}`">
              <p slot="title">第{{index+1}}讲——{{chapter.title}}</p>
              <Card slot="content">
                <div slot="extra">
                  <span>已上课</span>
                  <Tooltip content="删除本节"
                           style="width:auto;">
                    <Button type="text"
                            @click="handleDelChapter('已上课',chapter.lesson_id,index)">
                      <CommonIcon :size="22"
                                  color="#999"
                                  type="_lajitong1 delete-btn" />
                    </Button>
                  </Tooltip>
                </div>
                <p>日期：{{chapter.date}}</p>
                <p>上课时间：{{chapter.start_time}}——{{chapter.end_time}}</p>
                <p>本节内容：
                  <Tag v-for="(tag,index) in chapter.brief"
                       style="font-size:18px;"
                       :key="index">{{tag}}</Tag>
                </p>
                <play-ppt :classFileList="chapter.files"
                          :hasChapter="true"></play-ppt>
              </Card>
            </Step>
            <!-- 未上课列表 -->
            <Step v-for="(chapter,index) in notChapterList"
                  :key="`notChapter${index}`"
                  :status="index===0?'process':'wait'"
                  :id="`NOT_CHAPTER_${index}`">
              <p slot="title">第{{hasLength+index+1}}讲——{{chapter.title}} </p>
              <Card slot="content">
                <svg v-if="!index&&isStarting"
                     slot="extra"
                     class="iconfont-svg"
                     aria-hidden="true"
                     style="font-size: 6em;height: 40px;">
                  <use xlink:href="#icon-shangkezhong"></use>
                </svg>
                <div v-else
                     slot="extra">
                  <span>未上课</span>
                  <Tooltip content="删除本节"
                           style="width:auto;">
                    <Button type="text"
                            @click="handleDelChapter('未上课',chapter.lesson_id,index)">
                      <CommonIcon :size="22"
                                  type="_lajitong1" />
                    </Button>
                  </Tooltip>
                </div>

                <p>本节内容：
                  <Tag v-for="(hasTag,index) in chapter.brief"
                       :color="index<4?tagColor[index]:tagColor[index%3-1]"
                       style="font-size:18px;"
                       :key="index">{{hasTag?hasTag:'空'}}</Tag>
                </p>
                <play-ppt :classFileList="chapter.files"
                          :hasChapter="false"></play-ppt>
              </Card>
            </Step>

          </Steps>
          <!-- 添加一节课的按钮 -->
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
      </i-col>
      <!-- 锚点链接 -->
      <i-col span="5"
             class="clo-anchor">
        <Anchor show-ink
                container=".content-wrapper"
                style="position:fixed;font-size: 14px;">
          <Icon type="md-list" />目录
          <AnchorLink :title="`已上课（${hasLength}）`"
                      href="#HAS_CHAPTER_0">
            <AnchorLink v-for="(chapter,index) in hasChapterList"
                        :key="'anchor_'+index"
                        :title="`第${index+1}讲—${chapter.title}`"
                        :href="`#HAS_CHAPTER_${index}`"></AnchorLink>
          </AnchorLink>
          <AnchorLink :title="`未上课（${notChapterList.length}）`"
                      :href="notChapterList.length?'#NOT_CHAPTER_0':`#HAS_CHAPTER_${hasLength-1}`">
            <AnchorLink v-for="(chapter,index) in notChapterList"
                        :key="'anchor_'+index"
                        :title="`第${hasLength+index+1}讲—${chapter.title}`"
                        :href="`#NOT_CHAPTER_${index}`"></AnchorLink>
          </AnchorLink>
        </Anchor>
      </i-col>
    </Row>
    <!-- 添加一节课按钮 -->
    <div class="btn-add-chapter-wrapper">
      <Poptip trigger="hover"
              :title="btnTitle"
              word-wrap
              placement='left'>
        <span slot="content"
              style="font-size:16px;">{{btnContent}}</span>
        <Button type="primary"
                icon="md-add"
                class="btn-add-chapter"
                style="width:48px;height:40px;"
                @click="handleAddChapter">
        </Button>
      </Poptip>
    </div>
  </div>
</template>
<script>
import { getChapters, deleteChapter, addChapter } from '@/api/classCenter'
import CommonIcon from '_c/common-icon'
import { getIsStartingLocalstorage } from '@/libs/util'
import { ShareOrImport } from '@/api/file'
import PlayPpt from './playPpt.vue'
import AddChapter from './addChapter.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'classCatalog',
  components: {
    PlayPpt,
    AddChapter,
    CommonIcon
  },
  data () {
    return {
      notChapterList: [],
      hasChapterList: [],
      tagColor: ['geekblue', 'green', 'orange', 'red'],
      btnTitle: '添加章节',
      btnContent: '填写章节的信息'
    }
  },
  computed: {
    ...mapGetters([
      "isStarting"
    ]),
    hasLength () {
      return this.hasChapterList.length
    }
  },
  watch: {
    isStarting: {
      handler (newVal) {
        if (!newVal) {
          this.handleGetChapters()
        }
      }
    }
  },
  mounted () {
    this.handleGetChapters()
  },
  methods: {
    // 获取章节目录
    handleGetChapters () {
      getChapters().then(res => {
        if (res.status === 200) {
          this.notChapterList = res.raw_data
          this.hasChapterList = res.history_data
        } else {
          this.$Message.error(res.message)
        }
      }).catch(err => console.log(err))
    },
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
            this.$Message.success('添加成功！')
          } else if (lesson_id === 'false') {
            this.$Message.error('添加失败，服务器出现故障。')
          }
          else {
            addChapter({
              title: title,
              brief: brief.toString()
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
<style lang="less">
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
.chapter-wrap p {
  font-size: 16px;
  margin: 4px 3px 5px 3px;
}

.btn-add-chapter-wrapper {
  position: fixed;
  bottom: ~"calc(8% + 43px)";
  right: 5%;
  font-size: 20px !important;
  z-index: 2;
}
.btn-add-chapter i {
  color: #fff;
  font-size: 24px;
  margin-left: -3px;
  line-height: 1 !important;
}
.btn-add-chapter:hover {
  background-color: #f44336 !important;
  border-color: #f44336 !important;
}
.clo-anchor {
  .ivu-anchor {
    padding-left: 10px;
  }
}
</style>
