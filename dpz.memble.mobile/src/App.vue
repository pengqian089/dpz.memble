<template>
  <div class="van-safe-area-top"></div>
  <van-config-provider theme="dark">
    <router-view></router-view>
    <van-tabbar route>
      <van-tabbar-item icon="setting-o" to="/">设置</van-tabbar-item>
      <van-tabbar-item icon="description" to="/article">文章</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/mumble">碎碎念</van-tabbar-item>
      <van-tabbar-item icon="notes-o" to="/timeline">时间轴</van-tabbar-item>
    </van-tabbar>
  </van-config-provider>
  <div class="van-safe-area-bottom"></div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    }
  }
}
</script>

<style>
body {
  background: #404444;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #bdb5aa;
  margin-bottom: var(--van-tabbar-height);
  padding-bottom: 1em;
  max-width: 100vw;
}

pre {
  max-width: 100%;
  overflow: auto;
  padding: 1em;
}

.query-action{
  margin: 1em 0;
  display: flex;
  justify-content: space-between;
}

.list-item {
  margin-bottom: 1em;
}

.wrapper{
  top: 50%;
  right: 50%;
  position: absolute;
}
</style>
