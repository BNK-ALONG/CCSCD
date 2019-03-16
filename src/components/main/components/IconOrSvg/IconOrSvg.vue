<template>
  <div class="btn-openQRImg">
    <Tooltip :content="tootipContent"
             style="width:auto;">
      <Button type="text">
        <CommonIcon v-if="iconOrSvg==='icons'"
                    :size="iconSize"
                    :type="type" />
        <svg v-else
             class="iconfont-svg"
             aria-hidden="true"
             style="font-size: 30px;">
          <use :xlink:href="type"></use>
        </svg>
      </Button>
    </Tooltip>
  </div>

</template>
<script>
import CommonIcon from '_c/common-icon'
import '@/assets/icons/iconfont.js'
export default {
  name: 'IconOrSvg',
  components: {
    CommonIcon
  },
  props: {
    iconOrSvg: {
      type: String,
      default: 'icons'
    },
    iconSize: {
      type: Number,
      default: 25
    },
    type: {
      type: String
    },
    tootipContent: String
  }
  ,
  data () {
    return {
    }
  },
  methods: {
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
