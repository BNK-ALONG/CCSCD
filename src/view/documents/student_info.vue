<template>
  <div>
    <Card>
      <tables ref="tables"
              border
              editable
              searchable
              search-place="top"
              v-model="tableData"
              :columns="columns"
              @on-delete="handleDelete" />
      <!-- 上传学生信息按钮 -->
      <!-- name 和action是必需的，否则无法上传 -->
      <Upload multiple
              name="myfiles"
              action="/documents/student_file">
        <Button type="success"
                icon="md-cloud-upload"
                custom-icon="btn-icon">上传学生信息</Button>
      </Upload>
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
        { title: '学号', key: 'stuid', sortable: true, width: 250, align: 'center' },
        { title: '姓名', key: 'name', editable: true, maxWidth: 150, align: 'center' },
        {
          title: '性别',
          key: 'sex',
          maxWidth: 100,
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
        { title: '专业', key: 'major', align: 'center' },
        { title: '班级', key: 'classnum', align: 'center' },
        {
          title: '解绑',
          key: 'handle',
          maxWidth: 90,
          align: 'center',
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
          title: '解绑出现错误！',
          content: error
        })
      })

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
        title: '学生信息获取失败',
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
