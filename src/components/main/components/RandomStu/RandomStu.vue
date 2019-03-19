<template>
  <div class="btn-openQRImg">
    <Tooltip content="随机点人"
             style="width:auto;">
      <Button type="text"
              @click="handleRandomStu">
        <svg class="iconfont-svg"
             aria-hidden="true"
             style="font-size: 30px;">
          <use xlink:href="#icon-kulou-"></use>
        </svg>
      </Button>
    </Tooltip>
    <Modal title="恭喜这位同学喜提一次回答问题的机会！"
           v-model="visible"
           footer-hide>
      <div slot="header">
        <svg class="iconfont-svg"
             aria-hidden="true"
             style="font-size: 30px;">
          <use xlink:href="#icon-qingzhu"></use>
        </svg>
        <svg class="iconfont-svg"
             aria-hidden="true"
             style="font-size: 30px;">
          <use xlink:href="#icon-qingzhu"></use>
        </svg>
        <svg class="iconfont-svg"
             aria-hidden="true"
             style="font-size: 30px;">
          <use xlink:href="#icon-qingzhu"></use>
        </svg>
        <span style="font-size:16px;font-weight: bold;color: #17233d;">恭喜这位同学喜提一次回答问题的机会！</span>
        <svg class="iconfont-svg"
             aria-hidden="true"
             style="font-size: 30px;">
          <use xlink:href="#icon-gongxifacai"></use>
        </svg>
      </div>
      <div class="input-wrap">
        <Input :value="stuid"
               style="margin:10px;width:70%;color:#000;"
               type="text"
               disabled>
        <span slot="prepend">学生学号</span>
        </Input>
        <Input :value="stuname"
               style="margin:10px;width:70%;color:#000;"
               type="text"
               disabled>
        <span slot="prepend">学生姓名</span>
        </Input>

      </div>
    </Modal>
  </div>
</template>
<script>
import CommonIcon from '_c/common-icon'
export default {
  name: 'RandomStu',
  components: {
    CommonIcon
  },
  data () {
    return {
      iconSize: 25,
      visible: false,
      stuid: '',
      stuname: ''
    }
  },
  methods: {
    handleRandomStu () {
      this.$store.dispatch("getRandomStu").then(res => {
        this.stuid = res.stuid
        this.stuname = res.name
        this.visible = true
      }).catch(err => this.$Message.error(err))
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
.input-wrap {
  .ivu-input-wrapper {
    font-size: 24px;
    input {
      font-size: 24px;
    }
  }
}
</style>
