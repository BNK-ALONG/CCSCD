<template>
  <Collapse accordion>
    <Panel name="1">
      本节课件 <Badge style="margin-left: 10px"
             :class-name="fileBadge"
             :count="classFileList.length"></Badge>
      <Table ref="fileList"
             slot="content"
             stripe
             border
             width='auto'
             :columns="columns"
             :data="classFileList">

        <template slot-scope="{row,index}"
                  slot="share">
          <!-- 这里的slot-scope="{row}"只有获取行的数据，不具有修改本行的数据源的能力 -->
          <i-switch v-model="row.ShareStatus"
                    :true-value="trueVal"
                    :false-value="falseVal"
                    @on-change="statusChange(index,row.ShareStatus,'分享')">
            <Icon type="md-checkmark"
                  slot="open"></Icon>
            <Icon type="md-close"
                  slot="close"></Icon>
          </i-switch>
        </template>
        <template slot-scope="{row}"
                  slot="show">
          <Button type="success"
                  @click="handleShowFile(row.extension,row.file_name_uuid)"
                  target="_blank">展示</Button>

        </template>
      </Table>
    </Panel>

  </Collapse>

</template>
<script>
import { showFileList, showOneFile, exportFile } from '@/api/classCenter'
import { ShareOrImport } from '@/api/file'

export default {
  name: 'PlayPpt',
  data () {
    return {
      trueVal: 1,
      falseVal: 0,
      pdfURL: 'https%3A%2F%2Fwww.psycollege.com.cn%2Fclass_center%2Ftest_file%3Ffile_name_uuid%3D',
      pdfUrl: 'https://www.psycollege.com.cn/class_center/show_file?file_name_uuid=',
      pptUrl: 'https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fwww.psycollege.com.cn%2Fclass_center%2Fshow_file%3Ffile_name_uuid%3D',
      publicPath: process.env.BASE_URL,
      columns: [
        {
          type: 'index',
          width: 70,
          //title表头名
          title: '索引',
          //key对对应一下的字段名
          align: 'center',
        },
        {
          title: '上课文件',
          key: 'file_name',
          sortable: true,
          align: 'center',
          width: 460,
          // maxWidth: 500,
          // ellipsis超出部分显示为省略号
          ellipsis: true,
          // tooltip超出一定字数的单元格用气泡提示出来
          tooltip: true,
        },
        {
          title: '格式',
          key: 'extension',
          align: 'center',
          width: 100,
          filters: [
            {
              label: 'pdf',
              value: 'pdf'
            },
            {
              label: 'ppt',
              value: 'ppt'
            }
          ],
          filterMethod (value, row) {
            return row.extension === value
          }
        },
        {
          title: '分享',
          key: 'ShareStatus',
          slot: 'share',
          align: 'center',
          sortable: true,
          maxWidth: 90,
        },
        {
          title: '展示',
          key: 'file_name_uuid',
          slot: 'show',
          align: 'center',
          maxWidth: 100,
        }
      ],
    }
  },
  props: {
    classFileList: {
      type: Array,
      default: () => []
    },
    hasChapter: Boolean,
  },
  computed: {
    fileBadge () {
      return this.hasChapter ? 'gray-dadge' : 'black-dadge'
    }
  },
  methods: {
    // 分享和取消分享成功或失败、导入和取消导入成功或失败的提示信息
    share_import_change ({ ResponseStatus, ResponseMessage, statusType, status, file_name }) {
      if (ResponseStatus === 200) {
        if (status === 0) {
          this.$Notice.success({
            title: '取消' + statusType,
            desc: "文件——“" + file_name + "”" + '——已取消' + statusType + '!',
            duration: 6
          })
        } else {
          this.$Notice.success({
            title: '文件' + statusType,
            desc: "文件——“" + file_name + "”" + '——' + statusType + '成功！',
            duration: 6
          })
        }
      } else {
        if (status === 0) {
          this.$Notice.error({
            title: '取消' + statusType + '失败！',
            desc: ResponseMessage
            // desc: "文件——“" + file_name + "”" + '——取消' + statusType + '失败！' + '<br>失败原因：' + ResponseMessage
          })
        } else {
          this.$Notice.error({
            title: '文件' + statusType + '失败！',
            desc: ResponseMessage
            // desc: "文件——“" + file_name + "”" + '——' + statusType + '失败！' + '<br>失败原因：' + ResponseMessage
          })
        }
      }
    },
    //导入和分享按钮的响应
    statusChange (index, status, statusType) {
      console.log(index)
      let file_name_uuid = this.classFileList[index].file_name_uuid
      let file_name = this.classFileList[index].file_name
      console.log(file_name + statusType + '：' + status)
      ShareOrImport({
        statusType: statusType,
        file_name_uuid: file_name_uuid,
        status: status
      }).then(res => {
        this.share_import_change(
          {
            ResponseStatus: res.status,
            ResponseMessage: res.message,
            status: status,
            statusType: statusType,
            file_name: file_name
          })
      }).catch(error => {
        this.$Modal.error({
          title: '异常',
          content: error
        })
      })
    },

    // 点击展示按钮，分别调用不同的接口展示pdf和ppt
    handleShowFile (extension, file_name_uuid) {
      console.log(extension)
      if (extension === 'pdf') {
        let url = encodeURIComponent(this.pdfUrl + file_name_uuid)
        window.open(`${this.publicPath}pdf/web/viewer.html?file=` + url)
      } else {
        window.open(this.pptUrl + file_name_uuid)
      }
      showOneFile({ file_name_uuid }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="less">
.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
  color: inherit;
}
.gray-dadge {
  background: gainsboro;
}
.black-dadge {
  background: #515a6e;
}
</style>