<template>
  <div class="btn-openQRImg">
    <Tooltip content="二维码绑定课堂"
             style="width:auto;">
      <Button type="text"
              @click="openQRImg">
        <CommonIcon :size="iconSize"
                    type="_barcode-qr" />
      </Button>
    </Tooltip>
    <Modal title="扫描二维码绑定此课堂"
           v-model="visible"
           footer-hide>
      <img :src="imgUrl"
           v-if="visible"
           style="width: 100%">
    </Modal>
  </div>

</template>
<script>
import CommonIcon from '_c/common-icon'

export default {
  name: 'QRImg',
  components: {
    CommonIcon
  },
  data () {
    return {
      iconSize: 25,
      visible: false,
    }
  },
  computed: {
    imgUrl () {
      return this.$store.state.app.QRbs64
    }
  },
  methods: {
    openQRImg () {
      this.visible = true;
    }
  },
}
</script>

<style lang="less">
.btn-openQRImg {
  margin-right: 12px;
  .ivu-btn.ivu-btn-text {
    padding: 5px 1px 6px;
  }
}
</style>
