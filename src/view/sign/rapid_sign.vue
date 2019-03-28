<template>

</template>
<script>
import { rapidSign } from '@/api/sign'
import { mapMutations } from 'vuex'
export default {
  methods: {

  },
  mounted () {
    rapidSign().then(res => {
      if (res.status === 200) {
        // 开始的时间，单位毫秒
        sessionStorage.setItem('startTime', Date.now())
        // 时间间隔，单位毫秒
        sessionStorage.setItem('interval', res.interval * 60 * 1000)
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
          content: res.message,
          loading: true,
          onOk: () => {
            setTimeout(() => {
              this.$Modal.remove();
              this.$router.push({
                name: 'record_sign'
              })
            }, 2000);
          }
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
