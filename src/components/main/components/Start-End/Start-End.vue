<template>
  <div class="btn-openQRImg">
    <Tooltip :content="isStart?'开始上课':'下课'"
             style="width:auto;">
      <Button type="text"
              @click="handleStartEnd">
        <svg v-if="isStart"
             class="iconfont-svg"
             aria-hidden="true"
             style="font-size: 30px;">
          <use xlink:href="#icon-bofang1"></use>
        </svg>
        <svg v-else
             class="iconfont-svg"
             aria-hidden="true"
             style="font-size: 30px;">
          <use xlink:href="#icon-zanting"></use>
        </svg>
      </Button>
    </Tooltip>
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
      isStart: true,
      brief: ''
    }
  },
  methods: {
    handleStartEnd () {
      let self = this
      if (self.isStart) {
        self.$Modal.confirm({
          title: '请简单介绍本节内容，以便学生复习',
          render: (h) => {
            return h('Input', {
              props: {
                value: self.brief,
                autofocus: true,
                placeholder: '本节简介，不超过100字。',
                clearable: true,
                maxlength: 100
              },
              on: {
                input: (val) => {
                  self.brief = val;
                }
              }
            })
          },
          onOk: () => {
            self.$store.dispatch("makeStart", self.brief).then(msg => self.$Message.success(msg)).catch(err => self.$Message.error(err))
            self.isStart = !self.isStart
          },
          onCancel: () => {
            // 
          }
        })
      } else {
        self.$store.dispatch("makeEnd").then(msg => self.$Message.success(msg)).catch(err => self.$Message.error(err))
        self.isStart = !self.isStart
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
.iconfont-svg {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
