<template>
  <div>
    <Input v-model="titleVal"
           placeholder="公告的标题" />
    <br><br>
    <Input v-model="contentVal"
           type="textarea"
           :autosize="{minRows: 2,maxRows: 5}"
           placeholder="公告的内容" /><br><br>
    <Button type="success"
            @click="handleSendNewNotice">发布新公告</Button><br><br>
    <Button type="success"
            @click="handleAllNotice">全部公告</Button><br><br>
    <Button type="success"
            @click="handleSaveNotice">保存为草稿箱公告</Button><br><br>
    <Button type="success"
            @click="handleSendDraftNotice">发布草稿箱的公告</Button><br><br>
    <Button type="error"
            @click="handleDelNoticeById">删除公告</Button>

  </div>
</template>
<script>
import { sendNewNotice, getAllNotice, delNoticeById, saveDraftNotice, sendDraftNotice } from '@/api/classCenter'
export default {
  name: 'TestSign',
  data () {
    return {
      titleVal: '',
      contentVal: ''
    }
  },
  methods: {
    handleSendNewNotice () {
      sendNewNotice({
        title: this.titleVal,
        content: this.contentVal
      }).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.$Message.success({
            content: res.message,
            duration: 3
          })
        } else {
          this.$Message.error({
            content: res.message,
            duration: 3
          })
        }
      }).catch(err => {
        this.$Modal.error({
          title: '发布公告失败，请联系管理员。',
          content: err
        })
      })
    },
    handleAllNotice () {
      getAllNotice().then(res => {
        if (res.status === 200) {
          console.log(res)
        } else {
          this.$Message.error({
            content: res.message,
            duration: 3
          })
        }
      }).catch(err => {
        this.$Modal.error({
          title: '获取历史公告失败，请联系管理员。',
          content: err
        })
      })
    },
    handleDelNoticeById () {
      delPastNotice(notice_uid).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.$Notice.success(res.message)
        } else {
          this.$Notice.error(res.message)
        }
      }).catch(err => {
        this.$Modal.error({
          title: '删除公告失败，请联系管理员。',
          content: err
        })
      })
    },

    // 保存草稿箱公告
    handleSaveNotice () {
      saveDraftNotice({
        title: this.titleVal,
        content: this.contentVal
      }).then(res => {
        if (res.status === 200) {
          console.log(res)
          this.$Message.success({
            content: res.message,
            duration: 3
          })
        } else {
          this.$Message.error({
            content: res.message,
            duration: 3
          })
        }
      }).catch(err => {
        this.$Modal.error({
          title: '保存公告失败，请联系管理员。',
          content: err
        })
      })
    },
  },
}
</script>