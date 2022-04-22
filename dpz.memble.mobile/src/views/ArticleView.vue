<template>

  <van-overlay :show="showDelete" z-index="2">
    <div class="wrapper">
      <van-loading>正在删除...</van-loading>
    </div>
  </van-overlay>
  <van-nav-bar title="我的文章"/>
  <div style="padding:0.5em">
    <van-skeleton row="5" :loading="isLoading">
      <van-collapse v-model="activeNames" style="margin-bottom: 1em">
        <van-collapse-item title="搜索" name="1">
          <van-cell-group inset>
            <van-field v-model="title" label="标题" placeholder="标题"/>

            <van-field
                v-model="tag"
                name="tag"
                is-link
                readonly
                label="标签"
                placeholder="选择选择标签"
                @click="showTag = true"
                :rules="[{ required: true, message: '请选择标签' }]"
            />
            <van-popup v-model:show="showTag" round position="bottom">
              <van-picker
                  :columns="tags"
                  @cancel="cancelPick"
                  @confirm="pickTag"
              />
            </van-popup>
            <div class="query-action">
              <van-button type="success" @click="this.$router.push({name:'publish-article'})">发布文章</van-button>
              <van-button type="primary" @click="loadArticles">查询</van-button>
            </div>

          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
      <van-list
          class="list-item"
          :finished="true"
          v-for="item in list" :key="item.id"
      >
        <van-cell title="标题" is-link :value="item.blogTitle" :url="`/article/read/${item.id}.html`"/>
        <van-cell title="回复量" :value="item.commentCount"/>
        <van-cell title="访问次数" :value="item.viewCount"/>
        <van-cell title="标签" :value="item.tag"/>
        <van-cell title="发布时间" :value="item.createTime"/>
        <van-cell title="最后修改时间" :value="item.lastUpdateTime"/>
        <van-cell title="Markdown" is-link :value="item.isShowMk === true ? '收起' : '展开'" @click="showMarkdown(item)"/>
        <div :style="{display:(item.isShowMk === true ? 'block' : 'none')}">
          <pre><code class="language-markdown line-numbers match-braces">{{ item.markdown }}</code></pre>
        </div>
        <div class="van-cell">
          <div class="van-cell__title">
            <van-button type="primary" @click="editArticle(item)">修改</van-button>
          </div>
          <div class="van-cell__value">
            <van-button type="danger" @click="deleteArticle(item)">删除</van-button>
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
import Prism from "prismjs";
import dayjs from "dayjs";
import {Dialog} from "vant";

export default {
  name: "ArticleView",
  data() {
    return {
      pageIndex: 1,
      list: [],
      total: 0,
      title: "",
      tag: "",
      activeNames: [],
      isLoading: true,
      tags: [],
      showTag: false,
      showDelete: false,
    };
  },
  async mounted() {
    await this.loadTags();
    await this.loadArticles();
  },
  updated() {
    Prism.highlightAll();
  },
  methods: {
    /**
     * 展示文章markdown内容
     * */
    showMarkdown(article) {
      article.isShowMk = article.isShowMk ? !article.isShowMk : true;
    },
    /**
     * 导航到编辑文章
     * */
    editArticle(article) {
      this.$router.push({name: `edit-article`, params: {id: article.id}});
    },
    /**
     * 删除文章
     * */
    async deleteArticle(article) {
      await Dialog.confirm({title: "提示", message: `删除后不可恢复，确定要删除《${article.blogTitle}》吗？`});

      this.showDelete = true;
      let formData = new FormData();
      formData.append("id", article.id);
      let response = await fetch("/Article/Delete", {method: "post", body: formData});
      let that = this;
      await this.$handleResponse(response, () => that.showDelete = false);
      this.showDelete = false;
      await this.loadArticles();
    },
    /**
     * 加载文章列表
     * */
    async loadArticles() {
      this.isLoading = true;
      let response = await fetch(`/Article/MyArticle?pageIndex=${this.pageIndex}&title=${encodeURIComponent(this.title)}&tag=${encodeURIComponent(this.tag)}`);
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
    /**
     * 加载文章标签
     * */
    async loadTags() {
      let response = await fetch(`/Article/Tags`);
      let result = await this.$handleResponse(response);
      for (let item of result) {
        this.tags.push({text: item, value: item});
      }
    },
    /**
     * 翻页
     * */
    async toPage() {
      await this.loadArticles();
    },
    /**
     * 确定选择标签
     * */
    pickTag(selected) {
      this.showTag = false;
      this.tag = selected.selectedOptions[0].text;
    },
    /**
     * 取消选择标签
     * */
    cancelPick() {
      this.tag = "";
      this.showTag = false;
    }
  }
}
</script>

<style scoped>

</style>