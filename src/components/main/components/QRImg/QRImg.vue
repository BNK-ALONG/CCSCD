<template>
  <div class="btn-openQRImg">
    <Button type="text"
            @click="openQRImg">
      <CommonIcon :size="iconSize"
                  type="_barcode-qr" />
    </Button>
  </div>

</template>
<script>
import CommonIcon from '_c/common-icon'
import { getQRImg } from '@/api/sign'

export default {
  name: 'QRImg',
  components: {
    CommonIcon
  },
  data () {
    return {
      iconSize: 30
    }
  },
  methods: {
    openQRImg () {
      getQRImg().then(res => {
        console.log(res)
        return 'data:image/png;base64,' + btoa(
          new Uint8Array(res.file_get).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
      }).then(data => {
        obj.imgCodeUrl = data
      }).catch(error => {
        this.$Modal.error({
          title: '二维码获取失败，请联系管理员。',
          content: error
        })
      })
    }
  },
}
</script>

<style>
.btn-openQRImg {
  margin-right: 12px;
}
.btn-openQRImg > .ivu-btn.ivu-btn-text {
  padding: 5px 1px 6px;
}
</style>
