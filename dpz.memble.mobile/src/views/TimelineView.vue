<template>
  <van-nav-bar title="我的时间轴"/>
  <div style="padding: 0.5em">
    <van-skeleton row="5" :loading="isLoading">
      <van-collapse v-model="activeNames" style="margin-bottom: 1em">
        <van-collapse-item title="搜索" name="1">
          <van-cell-group inset>
            <van-field v-model="content" label="标题" placeholder="标题"/>
            <div class="query-action">
              <van-button type="success" @click="this.$router.push({name:'publish-timeline'})">发布时间轴</van-button>
              <van-button type="primary" @click="loadTimeline">查询</van-button>
            </div>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
      <van-list
          class="list-item"
          :finished="true"
          v-for="item in list" :key="item.id"
      >
        <van-cell title="标题" :value="item.title"/>
        <van-cell title="时间轴节点" :value="item.date"/>
        <van-cell title="链接" :value="item.more"/>
        <van-cell title="发布时间" :value="item.createTime"/>
        <van-cell title="最后修改时间" :value="item.lastUpdateTime"/>
        <van-cell title="内容" is-link :value="item.isShowMk === true ? '收起' : '展开'" @click="showMarkdown(item)"/>
        <div :style="{display:(item.isShowMk === true ? 'block' : 'none')}">
          <pre><code class="language-markdown line-numbers match-braces">{{ item.content }}</code></pre>
        </div>
        <div class="van-cell">
          <div class="van-cell__title">
            <van-button type="primary" @click="editTimeline(item)">修改</van-button>
          </div>
          <div class="van-cell__value">
            <van-button type="danger" @click="deleteTimeline(item)">删除</van-button>
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
  name: "TimelineView",
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
    await this.loadTimeline();
  },
  updated() {
    Prism.highlightAll();
  },
  methods: {
    async loadTimeline() {
      this.isLoading = true;
      let response = await fetch(`https://localhost:37701/Timeline/MyTimeline?pageIndex=${this.pageIndex}&content=${encodeURIComponent(this.content)}`);
      let result = await this.$handleResponse(response);
      for (let item of result.list) {
        item.lastUpdateTime = dayjs(item.lastUpdateTime).format("YYYY年MM月DD日 HH:mm:ss");
        item.createTime = dayjs(item.createTime).format("YYYY年MM月DD日 HH:mm:ss");
        item.date = dayjs(item.date).format("YYYY年MM月DD日");
        item.isLocalTime = true;
      }
      this.list = result.list;
      this.pageIndex = result.currentPage;
      this.total = result.totalCount;
      this.isLoading = false;
    },
    showMarkdown(mumble) {
      mumble.isShowMk = mumble.isShowMk ? !mumble.isShowMk : true;
    },
    editTimeline(timeline) {
      this.$router.push({name: "edit-timeline", params: {id: timeline.id}});
    },
    deleteTimeline() {

    },
    async toPage() {
      await this.loadTimeline();
    }
  }
}
</script>

<style scoped>

</style>