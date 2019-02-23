<template>
  <div class="className-wrap1">
    <div class="className-box1">{{className}}</div>
  </div>

</template>
<script>

export default {
  data () {
    return {
      className: 'p'
    }
  },
  mounted () {
    // 首字母大写
    this.className = this.className.substring(0, 1).toUpperCase() + this.className.substring(1)
    console.log(this.className)
  }
}
</script>
<style>
.className-wrap1 {
  /* 父元素根据内容改变大小 */
  width: auto;
  height: 44px;
  display: inline-block;
  background-color: #2d8cf0;
  border-radius: 15px 0px 15px 0px;
  display: table-cell;
  vertical-align: middle;
}
.className-box1 {
  color: #fff;
  font-size: 20px;
  /* font-family: "MV Boli"; */
  font-family: "LiSu";

  margin: 0px 10px;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
