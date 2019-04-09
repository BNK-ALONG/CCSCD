<template>
  <div class="data-visiable">
    <Card title="本课程的文件下载量"
          style="margin-top:20px;">

      <chart-cate :option="downloadOption"
                  style="height: 300px;width:100%;"></chart-cate>
    </Card>
    <Card title="全部签到记录"
          style="margin-top:20px;">

      <Button slot="extra"
              type="success"
              ref="btnUpload"
              icon="ios-download-outline"
              custom-icon="btn-icon"
              @click="handleAllSignRecord">数据导出</Button>
      <chart-cate style="height: 300px;width:100%;"
                  :option="signOption"></chart-cate>

    </Card>

  </div>
</template>
<script>
import { ChartCate } from '_c/charts'
import { downloadNumber, downloadBlob } from '@/api/file'
import { allLocatedRecord, allSignRecord } from '@/api/sign'
import { getDuration } from '@/api/classCenter'
import { getSignOption, getDownloadOption } from '@/libs/util'
export default {
  name: 'dataVis',
  components: {
    ChartCate
  },
  data () {
    return {
      downloadList: [],
      allSignList: []
    }
  },
  computed: {
    // 历史签到折线图的配置项
    signOption () {
      const option = getSignOption(this.allSignList)
      return option
    },

    // 文件下载量横向的柱状图的配置项
    downloadOption () {
      const option = getDownloadOption(this.downloadList)
      return option
    },
  },
  created () {
    allLocatedRecord().then(res => res.status === 200 ? this.allSignList = res.all_record_data : console.log(res.message)).catch(err => console.log(err))
    downloadNumber().then(res => res.status === 200 ? this.downloadList = res.send_data : this.$Message.error(res.message)).catch(err => console.log(err))
  },
  activated () {
    allLocatedRecord().then(res => res.status === 200 ? this.allSignList = res.all_record_data : console.log(res.message)).catch(err => console.log(err))
    downloadNumber().then(res => res.status === 200 ? this.downloadList = res.send_data : this.$Message.error(res.message)).catch(err => console.log(err))
  },
  methods: {
    handleTest () {
      console.log(this.getOption)
    },
    // 获取全部签到情况的表格
    handleAllSignRecord () {
      allSignRecord().then(res => {
        downloadBlob(res, '历史全部签到情况表.xls')
      }).catch(err => {
        this.$Modal.error({
          title: '获取全部的签到情况表失败！请联系管理员。',
          content: err
        })
      })
    },
  },
}
</script> 
<style lang="less">
.ivu-card-extra {
  right: 1px !important;
  top: 9px !important;
}
.btn-icon {
  font-size: 16px;
}
</style>
