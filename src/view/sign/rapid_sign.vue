<template>

</template>
<script>
import { rapidSign } from '@/api/sign'
export default {
  mounted () {
    rapidSign().then(res => {
      if (res.status === 200) {
        this.$router.push({
          name: 'record_sign'
        })
        this.$Notice.success({
          title: '发布签到成功！',
          desc: res.message,
          duration: 6
        })
      } else {
        this.$Modal.error({
          title: '错误警告',
          content: res.message
        })
      }
    }).catch(error => {
      this.$Modal.error({
        title: '快速签到失败！',
        content: error
      })
    })
  },
}
</script>
<style>
</style>
