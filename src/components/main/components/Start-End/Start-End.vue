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
import {
  setIsStartingLocalstorage,
  getIsStartingLocalstorage
} from '@/libs/util'
import { mapGetters } from 'vuex'
export default {
  name: 'StartEnd',
  components: {
    CommonIcon
  },
  data () {
    return {
      iconSize: 25,
      brief: '',
      title: ''
    }
  },
  computed: {
    ...mapGetters([
      "isStarting"
    ])
  },
  methods: {
    handleStartEnd () {
      if (this.isStarting) {
        this.$store.dispatch("makeEnd").then(msg => {
          this.$Message.success(msg)
        }).catch(err => this.$Message.error(err))
      } else {
        this.$store.dispatch("makeStart").then(msg => {
          this.$router.push({
            path: '/classCenter/chapters#NOT_CHAPTER_0'
          })
          this.$Message.success(msg)
        }).catch(err => this.$Message.error(err))
      }
    }
  }
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
