<template>

</template>
<script>
import { rapidSign } from '@/api/sign'
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations([
      "setTimerDown"
    ])
  },
  mounted () {
    rapidSign().then(res => {
      if (res.status === 200) {
        this.setTimerDown(res.interval)
        let startTime = Date.now()
        this.$router.go({
          name: 'record_sign',
          query: {
            startTime: startTime
          }
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
                name: 'issue_sign'
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
