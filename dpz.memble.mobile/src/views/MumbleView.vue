<template>
  <van-nav-bar title="我的碎碎念"/>
  <div style="padding: 0.5em">
    <van-skeleton row="5" :loading="isLoading">
      <van-collapse v-model="activeNames" style="margin-bottom: 1em">
        <van-collapse-item title="搜索" name="1">
          <van-cell-group inset>
            <van-field v-model="content" label="内容" placeholder="内容"/>
            <div class="query-action">
              <van-button type="success">发布碎碎念</van-button>
              <van-button type="primary" @click="loadMumble">查询</van-button>
            </div>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
      <van-list
          class="list-item"
          :finished="true"
          v-for="item in list" :key="item.id"
      >
        <van-cell title="点赞次数" :value="item.zan"/>
        <van-cell title="回复量" :value="item.commentCount"/>
        <van-cell title="发布时间" :value="item.createTime"/>
        <van-cell title="最后修改时间" :value="item.lastUpdateTime"/>
        <van-cell title="Markdown" is-link :value="item.isShowMk === true ? '收起' : '展开'" @click="showMarkdown(item)"/>
        <div :style="{display:(item.isShowMk === true ? 'block' : 'none')}">
          <pre><code class="language-markdown line-numbers match-braces">{{ item.markdown }}</code></pre>
        </div>
        <div class="van-cell">
          <div class="van-cell__title">
            <van-button type="primary" @click="editMumble(item)">修改</van-button>
          </div>
          <div class="van-cell__value">
            <van-button type="danger" @click="deleteMumble(item)">删除</van-button>
          </div>
        </div>
      </van-list>
      <van-pagination
          v-model="pageIndex"
          :total-items="total"
          :show-page-size="3"
          force-ellipses
          @change="toPage"
      />
    </van-skeleton>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Prism from "prismjs";

export default {
  name: "MumbleView",
  data() {
    return {
      pageIndex: 1,
      list: [],
      total: 0,
      content: "",
      isLoading: true,
      activeNames: []
    }
  },
  async mounted() {
    await this.loadMumble();
  },
  updated() {
    Prism.highlightAll();
  },
  methods: {
    async loadMumble() {
      this.isLoading = true;
      let response = await fetch(`https://localhost:37701/Talk/MyTalk?pageIndex=${this.pageIndex}&content=${encodeURIComponent(this.content)}`);
      let result = await this.$handleResponse(response);
      for (let item of result.list) {
        item.lastUpdateTime = dayjs(item.lastUpdateTime).format("YYYY年MM月DD日 HH:mm:ss");
        item.createTime = dayjs(item.createTime).format("YYYY年MM月DD日 HH:mm:ss");
        item.isLocalTime = true;
      }
      this.list = result.list;
      this.pageIndex = result.currentPage;
      this.total = result.totalCount;
      this.isLoading = false;
    },
    async toPage() {
      await this.loadMumble();
    },
    showMarkdown(mumble) {
      mumble.isShowMk = mumble.isShowMk ? !mumble.isShowMk : true;
    },
    editMumble(mumble) {
      this.$router.push({name: "edit-mumble", params: {id: mumble.id}});
    },
    deleteMumble() {

    }
  }
}
</script>

<style scoped>

</style>