<template>
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
        <van-cell title="标题" :value="item.blogTitle"/>
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
//import Article from "../data/article";
import Prism from "prismjs";
import dayjs from "dayjs";
import {Dialog, Notify} from "vant";

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
      showTag: false
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
    showMarkdown(article) {
      article.isShowMk = article.isShowMk ? !article.isShowMk : true;
    },
    editArticle(article) {
      this.$router.push({name: `edit-article`, params: {id: article.id}});
    },
    async deleteArticle(article) {
      await Dialog.confirm({title: "提示", message: `删除后不可恢复，确定要删除《${article.blogTitle}》吗？`});

      let formData = new FormData();
      formData.append("id", article.id);
      let response = await fetch("/Article/Delete", {method: "post", body: formData});
      await this.$handleResponse(response);
      await this.loadArticles();
    },

    async loadArticles() {
      this.isLoading = true;
      let response = await fetch(`https://localhost:37701/Article/MyArticle?pageIndex=${this.pageIndex}&title=${encodeURIComponent(this.title)}&tag=${encodeURIComponent(this.tag)}`);
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
    async loadTags() {
      let response = await fetch(`https://localhost:37701/Article/Tags`);
      if (response.ok) {
        let result = await response.json();
        if (result.success) {
          for (let item of result.data) {
            this.tags.push({text: item, value: item});
          }
        } else {
          Notify({type: "warning", message: result.msg});
        }
      } else {
        Notify({type: "warning", message: response.statusText});
      }
    },
    async toPage() {
      await this.loadArticles();
    },
    pickTag(selected) {
      this.showTag = false;
      this.tag = selected.selectedOptions[0].text;
    },
    cancelPick() {
      this.tag = "";
      this.showTag = false;
    }
  }
}
</script>

<style scoped>

</style>