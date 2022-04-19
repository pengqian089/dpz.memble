<!--<template>-->
<!--  <nav>-->
<!--    <router-link to="/">Home</router-link> |-->
<!--    <router-link to="/about">About</router-link>-->
<!--    |-->
<!--    <router-link to="/about2">About2</router-link>-->
<!--  </nav>-->
<!--  <router-view/>-->
<!--</template>-->

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="auto" class="menu">
        <aside-menu></aside-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <common-header></common-header>
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AsideMenu from "@/components/AsideMenu.vue";
import CommonHeader from "@/components/CommonHeader";

export default {
  components: {AsideMenu,CommonHeader}
}


</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: #05171c;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--el-color-primary-light-9);
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.menu {
  background: #2c3e50;
  height: 100vh;
}

.header {
  background: #101d2a;
}

.el-pagination {
  justify-content: center;
  margin-top: 1em;
}

.el-loading-mask{
  background-color: var(--el-overlay-color-light) !important;
}

.page-title{
  text-align: left;
}
</style>
