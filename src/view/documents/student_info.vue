<template>
  <div>
    <Card>
      <!-- 上传学生信息按钮 -->
      <!-- name 和action是必需的，否则无法上传 -->
      <Upload multiple
              name="myfiles"
              action="/documents/student_file"
              :on-success="uploadStuSuccess"
              accept=".xls, .xlsx">
        <Button type="success"
                ref="btnUpload"
                icon="md-cloud-upload"
                custom-icon="btn-icon">上传学生信息</Button>
        <!-- <span>仅支持上传后缀为.xlsx或者.xls的EXCEL文件。</span> -->
      </Upload>

      <tables ref="tables"
              border
              editable
              :isShowLoadBtn="true"
              searchable
              search-place="top"
              v-model="tableData"
              :columns="columns"
              @on-delete="handleDelete" />

      <!-- <Button style="margin: 10px 0;"
              type="primary"
              @click="exportExcel">导出为Csv文件</Button> -->
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getTableData, deleteStu } from '@/api/file'
export default {
  name: 'student_info',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: '学号', key: 'stuid', align: 'center' },
        { title: '姓名', key: 'name', align: 'center' },
        {
          title: '性别',
          key: 'sex',
          maxWidth: 90,
          align: 'center',
          filters: [
            {
              label: '男',
              value: 'man'
            },
            {
              label: '女',
              value: 'woman'
            }

          ],
          filterMethod (value, row) {
            return row.sex === value
          }
        },
        { title: '大学', key: 'college', align: 'center' },
        { title: '学院', key: 'academy', align: 'center' },
        { title: '专业', key: 'major', align: 'center' },
        { title: '班级', key: 'classnum', maxWidth: 100, align: 'center' },
        {
          title: '解绑',
          key: 'handle',
          maxWidth: 90,
          // align: 'center',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要解绑此学生吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              })
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {

    // 解除绑定学生与课堂
    handleDelete (params) {
      deleteStu({ stuid: params.row.stuid }).then(res => {
        if (res.status === 200) {
          this.$Notice.success({
            title: '解绑了姓名为：' + params.row.name + '的学生。'
          })
        } else {
          this.$Notice.error({
            title: res.message
          })
        }
      }).catch(error => {
        this.$Modal.error({
          title: '解绑出现错误，请联系管理员。',
          content: error
        })
      })

    },
    // 上传之前，判断是否是xlsx或xls文件
    // handleBeforeUpload (file) {
    //   const fileExt = file.name.split('.').pop().toLocaleLowerCase()
    //   if (fileExt === 'xlsx' || fileExt === 'xls') {
    //     this.readFile(file)
    //     this.file = file
    //   } else {
    //     this.$Notice.warning({
    //       title: '文件类型错误',
    //       desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
    //     })
    //   }
    //   return false
    // },
    // 上传文件成功之后，返回的钩子函数，返回字段为：response后台的信息，file单个文件信息，fileList文件列表信息
    // 三者关系：response包含于file，file包含于fileList
    // 上传文件之后把后台返回新添加的学生信息，添加到表格tables
    uploadStuSuccess (response, file, fileList) {
      console.log("response:", response)
      let Added_info = response.Added_info
      let len = Added_info.length
      if (len) {
        /* JavaScript合并数组的方法
        1.concat(arr1,arr2)
        2.for -push
        3..push.apply(arr1,arr2)
        */
        this.tableData.push.apply(this.tableData, Added_info)
        this.$Message.success({
          content: "更新了" + len + "条数据。",
          closable: true
        })
      } else {
        this.$Message.error({
          content: "没有新的学生数据，或者该学生不在数据库中。",
          closable: true
        })
      }

    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  mounted () {
    getTableData().then(res => {
      const status = res.status
      const message = res.message
      if (status === 200) {
        this.tableData = res.student_info
      } else {
        this.$Message.warning({
          duration: 2,
          closable: true,
          content: message
        })
      }
    }).catch(error => {
      this.$Modal.error({
        title: '学生信息获取失败，请联系管理员。',
        content: error
      })
    })
  }
}
</script>

<style>
.btn-icon {
  font-size: 18px;
}
</style>
