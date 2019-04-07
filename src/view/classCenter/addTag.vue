<template>
  <div class="m-t-b-10">
    <Tag :key="`tag_${index}`"
         :name="tag"
         class="chapter-tag"
         v-for="(tag,index) in dynamicTags"
         closable
         type="border"
         style="font-size:18px;"
         :color="index<4?tagColor[index]:tagColor[index%3-1]"
         @on-close="handleClose(tag)">
      {{tag}}
    </Tag>
    <Input class="input-new-tag"
           v-if="inputVisible"
           v-model="inputValue"
           ref="saveTagInput"
           size="large"
           @keyup.enter.native="handleInputConfirm"
           @on-blur="handleInputConfirm">
    </Input>
    <Button v-else
            class="button-new-tag"
            size="large"
            type="primary"
            ghost
            @click="showInput">+ 添加知识点</Button>
  </div>
</template>
<script>

export default {
  name: 'AddTag',
  data () {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      tagColor: ['geekblue', 'green', 'orange', 'red']
    };
  },

  methods: {
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this.$emit("on-add-tag", this.dynamicTags)
    },

    showInput () {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm () {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue)
        this.$emit("on-add-tag", this.dynamicTags)
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}
</script>
<style>
/* @import url("//unpkg.com/element-ui@2.7.0/lib/theme-chalk/index.css"); */
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 116px;
  height: 32px;

  vertical-align: bottom;
}
.ivu-tag .ivu-icon-ios-close {
  border-radius: 50%;
}
.ivu-tag-geekblue .ivu-icon-ios-close:hover {
  background-color: #adc6ff !important ;
}
.ivu-tag-green .ivu-icon-ios-close:hover {
  background-color: #b7eb8f !important ;
}
.ivu-tag-orange .ivu-icon-ios-close:hover {
  background-color: #ffd591 !important ;
}
.ivu-tag-red .ivu-icon-ios-close:hover {
  background-color: #ffa39e !important ;
}
.chapter-tag {
  font-size: 16px;
}
</style>
