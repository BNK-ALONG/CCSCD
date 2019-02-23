<template>
  <div id="app">

    <router-view />
  </div>

</template>

<script>
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
