<template>
  <div class="header-content">
    <el-button type="primary" :icon="IconMenu" @click="toggleMenu"/>

    <el-avatar src="https://localhost:7111/free/image/62569826b7349691b5e971d4?width=400&height=400"></el-avatar>
  </div>
</template>

<script>
import {
  Menu as IconMenu,
} from '@element-plus/icons-vue'

export default {
  name: "CommonHeader",
  data() {
    return {
      IconMenu
    }
  },
  methods:{
    toggleMenu(){
      this.$store.commit("collapseMenu");
    }
  }
}
</script>

<style scoped>
.header-content{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}
</style>