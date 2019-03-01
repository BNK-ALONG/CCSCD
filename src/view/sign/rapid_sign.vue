<template>
  <div class="sign-btn-wrap">
    <Tooltip theme="light"
             placement="right"
             max-width="250"
             :offset="tooltipOffset"
             always>
      <span slot="content"
            style="font-size:20px;margin-left:2em;">{{content}}</span>
      <Button type="primary"
              shape="circle"
              icon="md-power"
              style="border-radius: 50%;
                      width: 200px;
                      height: 200px;
                      margin-right:50px;"
              custom-icon="icon-btn"
              @click="handleRapidSign"><br><span style="font-size:20px;">一键签到</span></Button>
    </Tooltip>
  </div><!-- md-power -->
</template>
<script>
import { rapidSign } from '@/api/sign'
export default {
  data () {
    return {
      tooltipOffset: 0,
      content: '点击按钮，即可快速发布本节课上一次的签到'
    }
  },
  methods: {
    handleRapidSign () {
      rapidSign().then(res => {
        console.log(res.message)
        console.log(res.status)
        if (res.status === 200) {
          this.$router.push({
            name: 'record_sign'
          })
          this.$Message.success(res.message)
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
    }
  },
}
</script>
<style>
.sign-btn-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sign-btn-wrap button:hover {
  background-color: #f44336 !important;
  border-color: #f44336 !important;
}
.icon-btn {
  font-size: 100px;
}
</style>
