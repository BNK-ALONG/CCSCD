<template>
  <div>

    <div class="btn-openQRImg">
      <Tooltip :content="isStarting?'下课':'开始上课'"
               style="width:auto;">
        <Button type="text"
                @click="handleStartEnd">
          <svg v-if="isStarting"
               class="iconfont-svg"
               aria-hidden="true"
               style="font-size: 30px;">
            <use xlink:href="#icon-zanting"></use>
          </svg>
          <svg v-else
               class="iconfont-svg"
               aria-hidden="true"
               style="font-size: 30px;">
            <use xlink:href="#icon-bofang1"></use>
          </svg>
        </Button>
      </Tooltip>
    </div>

  </div>
</template>
<script>
import CommonIcon from '_c/common-icon'

export default {
  name: 'StartEnd',
  components: {
    CommonIcon
  },
  data () {
    return {
      iconSize: 25,
      isStarting: false,
      brief: '',
      title: ''
    }
  },
  methods: {
    handleStartEnd () {
      let self = this
      if (self.isStarting) {
        self.$store.dispatch("makeEnd").then(msg => {
          self.isStarting = !self.isStarting
          self.$Message.success(msg)
          self.$emit("on-start-change", self.isStarting)
        }).catch(err => self.$Message.error(err))
      } else {
        self.$store.dispatch("makeStart").then(msg => {
          self.isStarting = !self.isStarting
          self.$Message.success(msg)
          self.$emit("on-start-change", self.isStarting)
        }).catch(err => self.$Message.error(err))
        self.$store.dispatch("noteMessage").then(msg => {
          self.$Message.warning({
            content: msg,
            duration: 0,
            closable: true
          })
        })
      }

    }
  },
}
</script>

<style lang="less">
.btn-openQRImg {
  margin-right: 20px;
  .ivu-btn.ivu-btn-text {
    padding: 5px 1px 6px;
  }
}
</style>
