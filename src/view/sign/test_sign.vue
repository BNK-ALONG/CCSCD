<template>
  <div>
    <Card>
      <Button type="success"
              ref="btnUpload"
              icon="ios-download-outline"
              custom-icon="btn-icon"
              @click="handleNewSignRecord">最新签到表</Button>

      <Button type="success"
              ref="btnUpload"
              icon="ios-download-outline"
              custom-icon="btn-icon"
              style="margin-left:50px;"
              @click="handleAllSignRecord">全部签到表</Button>
      <tables ref="tables"
              border
              editable
              searchable
              search-place="top"
              v-model="located_records"
              :columns="columns"
              :isShowLoadBtn="false"
              @on-delete="handleDelete">
      </tables>

    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { allSignRecord, nowSignRecord, newSignRecord } from '@/api/sign'
import { downloadBlob } from '@/api/file'
export default {
  // name: 'record_sign',
  components: {
    Tables
  },
  data () {
    return {
      trueVal: '已签到',
      falseVal: '未签到',
      columns: [
        { title: '学号', key: 'stuid', width: 250, align: 'center' },
        { title: '姓名', key: 'stuname', maxWidth: 200, align: 'center' },
        {
          title: '签到状态',
          key: 'status',
          maxWidth: 150,
          align: 'center',
          sortable: true
        }
      ],
      located_records: [],
      timeoutID: ''
    }
  },
  created () {
    this.getNowSignRecord()
  },
  beforeRouteLeave (to, from, next) {
    clearTimeout(this.timeoutID)
    next()
  },
  methods: {
    handleChange ({ src, target, oldIndex, newIndex }) {
      this.handleList.push(`${src} => ${target}, ${oldIndex} => ${newIndex}`)
    },
    handleAllSignRecord () {
      allSignRecord().then(res => {
        downloadBlob(res, '全部签到表.xls')
      }).catch(err => {
        this.$Modal.error({
          title: '获取全部签到表失败！请联系管理员。',
          content: err
        })
      })
    },
    handleNewSignRecord () {
      newSignRecord().then(res => {
        downloadBlob(res, '最新签到表.xls')
      }).catch(err => {
        this.$Modal.error({
          title: '获取最新签到表失败！请联系管理员。',
          content: err
        })
      })
    },
    getNowSignRecord () {
      let self = this
      nowSignRecord().then(res => {
        if (res.status === 200) {
          self.located_records = res.located_records
          self.timeoutID = setTimeout(() => {
            self.getNowSignRecord()
          }, 5000)
        }
      }).catch(err => {
        self.$Modal.error({
          title: '获取当前的签到情况表失败！请联系管理员。',
          content: err
        })
      })
    }
  },
}
</script>

<style>
.btn-icon {
  font-size: 18px;
}
</style>
