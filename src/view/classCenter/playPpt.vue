<template>
  <div class="play-container">
    <Card class="table-card"
          title="课件列表"
          icon="ios-cloud">
      <div slot="extra">
        <img src="@/assets/images/class2.png"
             style="width:120px;">
      </div>
      <div>
        <!-- table表格的容器（为了使表格居中） -->
        <div class="table-btn-container">
          <Table ref="fileList"
                 stripe
                 width='auto'
                 :columns="columns"
                 :data="fileData">
            <template slot-scope="{row,index}"
                      slot="delete">
              <Poptip confirm
                      title="您确认导出此文件吗？"
                      @on-ok="handleDelFile(row.file_name_uuid,index)">
                <Button type="error">导出</Button>
              </Poptip>
            </template>
            <template slot-scope="{row}"
                      slot="show">
              <!-- 这里的slot-scope="{row}"只有获取行的数据，不具有修改本行的数据源的能力 -->
              <Button type="success"
                      @click="handleShowFile(row.file_name_uuid)"
                      :to="pptUrl+row.file_name_uuid"
                      target="_blank">展示</Button>
            </template>
          </Table>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import { showFileList, showOneFile, exportFile } from '@/api/classCenter'
import img1 from '@/assets/images/pexels-photo-207691.jpeg'
export default {
  name: 'playPpt',
  data () {
    return {
      pptUrl: 'https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fwww.psycollege.com.cn%2Fclass_center%2Ftest_file%3Ffile_name_uuid%3D',
      columns: [
        {
          type: 'index',
          width: 70,
          //title表头名
          title: '索引',
          //key对对应一下的字段名
          align: 'center',
          className: 'tableFontSize'
        },
        {
          title: 'PPT文件',
          key: 'file_name',
          sortable: true,
          align: 'center',
          width: 460,
          // maxWidth: 500,
          // ellipsis超出部分显示为省略号
          ellipsis: true,
          // tooltip超出一定字数的单元格用气泡提示出来
          tooltip: true,
          className: 'tableFontSize'

        },

        {
          title: '导出',
          key: 'file_name_uuid',
          slot: 'delete',
          width: 100,
          className: 'tableFontSize',
        },
        {
          title: '展示',
          key: 'file_name_uuid',
          slot: 'show',
          align: 'center',
          maxWidth: 100,
          className: 'tableFontSize',
        }
      ],
      fileData: []
    }
  },
  mounted () {
    this.getFileList()
  },
  activated () {
    // 请求后台获取文件列表
    this.getFileList()
  },
  methods: {
    getFileList () {
      showFileList().then(res => {
        const message = res.message
        const status = res.status
        if (status === 200) {
          this.fileData = res.file_info
        } else {
          this.$Modal.warning({
            title: '无课件！',
            content: '上课课件为空，请到数据中心进行文件导入。',
            onOk: () => {
              this.$router.push({
                name: 'file_list'
              })
            }
          })
        }
      }).catch(error => {
        this.$Modal.error({
          title: '文件列表获取失败！请联系管理员',
          content: error
        })
      })
    },
    handleDelFile (file_name_uuid, index) {
      exportFile({ file_name_uuid }).then(res => {
        if (res.status === 200) {
          this.$Message.success(res.message)
          this.fileData.splice(index, 1)
        } else {
          this.$Message.error(res.message)
        }
      }).catch(err => {
        this.$Modal.error({
          title: '删除文件异常!',
          content: err
        })
      })
    },
    handleShowFile (file_name_uuid) {

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
.tableFontSize {
  font-size: 16px;
}
.table-btn-container {
  display: -webkit-box;
  display: -ms-flexbox;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  -o-justify-content: center;
  justify-content: center;
  align-items: center;
  img {
    width: 300px;
  }
}
.play-container {
  height: 100%;
  width: 100%;
}
</style>
