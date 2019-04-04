<template>
  <div class="add-chapter">
    <p class="m-t-b-10">本节标题：<i>（如：认识计算机）</i></p>
    <Input v-model="title"
           class="m-t-b-10"
           placeholder="本节标题"
           @on-blur="handleTitle"></Input>
    <p class="m-t-b-10">本节知识点：</p>
    <add-tag @on-add-tag="handleAddTag"></add-tag>

    <p class="m-t-b-10">本节课件：</p>
    <Upload multiple
            :accept="accept"
            action="/class_center/upload_file"
            name="myfiles"
            class="m-t-b-10"
            :on-success="handleUploadSuccess">
      <Button icon="ios-cloud-upload-outline"
              type="success"
              ghost
              @click.once="handleSubmitAddChapter">上传文件</Button>
    </Upload>
  </div>
</template>
<script>
import { addChapter } from '@/api/classCenter'
import AddTag from './addTag.vue'
export default {
  name: 'AddChapter',
  components: {
    AddTag
  },
  data () {
    return {
      modal: false,
      title: '',
      brief: [],
      files: [],
      accept: '.pptx, .ppsx, .ppt, .pps, .potx, .ppsm, .pdf',
    }
  },
  watch: {
    files: {
      handler (newVal, oldVal) {
        this.$emit("on-change-files", newVal)
      }
    }
  },
  methods: {
    // 输入框失去焦点时，把值传给父组件
    handleTitle () {
      this.$emit("on-title-change", this.title)
    },
    // 提交标题和简介
    handleSubmitAddChapter () {
      addChapter({
        title: this.title,
        brief: this.brief.toString()
      }).then(res => {
        if (res.status === 200) {
          this.$emit("get-lessonId", res.lesson_id)
        } else {
          this.$emit("get-lessonId", 'false')
        }
      }).catch(err => console.log(err))
    },
    handleUploadSuccess (response, file, fileList) {
      this.files = response.files
    },

    //获取标签的值
    handleAddTag (tagList) {
      this.brief = tagList
      this.$emit('get-tag-value', this.brief)
    },
  },
}
</script>
<style >
.add-chapter p {
  font-weight: bold;
}
.m-t-b-10 {
  margin: 10px 0px;
}
</style>
