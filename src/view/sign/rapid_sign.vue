<template>
  <div class="btn-wrap">
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
              custom-icon="icon-btn"><br><span style="font-size:20px;">一键签到</span></Button>
    </Tooltip>
  </div><!-- md-power -->
</template>
<script>
export default {
  data () {
    return {
      tooltipOffset: 0,
      content: '点击按钮，即可快速发布本节课上一次的签到'
    }
  }
}
</script>
<style>
.btn-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-wrap button:hover {
  background-color: #f44336 !important;
  border-color: #f44336 !important;
}
.icon-btn {
  font-size: 100px;
}
</style>
