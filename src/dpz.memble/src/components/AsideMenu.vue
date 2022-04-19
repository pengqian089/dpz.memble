<template>
  <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
  >
    <div v-if="!isCollapse">
      <h5 class="member-title">被打断的狗腿</h5>
      <h3 class="member-title">
        个人中心
      </h3>
    </div>
    <el-menu-item index="1" @click="toPage('/')">
      <el-icon>
        <setting/>
      </el-icon>
      <template #title>
        基本设置
      </template>
    </el-menu-item>
    <el-menu-item index="2" @click="toPage('/article')">
      <el-icon>
        <icon-menu/>
      </el-icon>
      <template #title>
        我的文章
      </template>
    </el-menu-item>
    <el-menu-item index="3" @click="toPage('/mumble')">
      <el-icon>
        <document/>
      </el-icon>
      <template #title>
        碎碎念
      </template>
    </el-menu-item>
    <el-menu-item index="4" @click="toPage('/timeline')">
      <el-icon>
        <location/>
      </el-icon>
      <template #title>
        时间轴
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

export default {
  name: "AsideMenu",
  computed: {
    isCollapse() {
      console.log(this.$store.state.tab);
      return this.$store.state.tab.isCollapse;
    }
  },
  components: {
    Document,
    IconMenu,
    Location,
    Setting
  },
  data() {
    return {
      //isCollapse: false,
    };
  },
  methods: {
    handleOpen: function () {

    },
    handleClose: function () {

    },
    toPage(path){
      this.$router.push({path});
    }
  }
}
</script>

<style scoped>
.el-menu {
  height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.member-title {
  margin: 0;
  padding: 1em;
  background: #007ea3;
}

.el-menu-item a {
  color: var(--el-color-primary-light-9);
  text-decoration: none;
}

.el-menu-item.is-active {
  background-color: var(--el-text-color-regular);
}

.el-menu-item.is-active a {
  color: var(--el-menu-active-color);
}

.el-menu-item:hover {
  background-color: var(--el-text-color-primary);
}
</style>