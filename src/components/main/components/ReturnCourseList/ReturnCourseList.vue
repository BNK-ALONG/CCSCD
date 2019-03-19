<template>
  <div class="btn-openQRImg">
    <Tooltip content="返回我的课堂"
             style="width:auto;">
      <Button type="text"
              @click="handleTeturn">
        <CommonIcon :size="iconSize"
                    type="_i-fh" />
        <!-- <svg class="iconfont-svg"
             aria-hidden="true"
             style="font-size: 30px;">
          <use xlink:href="#icon-fanhui1"></use>
        </svg> -->
      </Button>
    </Tooltip>
  </div>

</template>
<script>
import CommonIcon from '_c/common-icon'

export default {
  name: 'ReturnCourseList',
  components: {
    CommonIcon
  },
  data () {
    return {
      iconSize: 25,
    }
  },
  methods: {
    handleTeturn () {
      this.$router.push({
        name: 'course_list'
      })
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
