<template>
  <div id="app">

    <router-view />
  </div>

</template>

<script>
export default {}
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  // overflow-y: scroll;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
.ivu-card {
  -webkit-box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  border-color: #eee;
}
.iconfont-svg {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
