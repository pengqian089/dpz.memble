<template>
  <van-nav-bar left-text="返回" left-arrow title="编辑文章" @click="back"/>
  <div style="padding:0.5em">
    <van-form @submit="publish" class="content">
      <van-cell-group inset>
        <van-field
            v-model="article.title"
            name="title"
            label="标题"
            placeholder="标题"
            :rules="[{ required: true, message: '请输入标题' }]"
        />
        <van-field
            v-model="article.tags"
            name="tags"
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
              :loading="tagLoading"
              @cancel="cancelPick"
              @confirm="pickTag"
          />
        </van-popup>
        <van-field
            v-model="article.newTag"
            name="newTag"
            label="添加标签"
            placeholder="标签"
        />
        <van-field
            v-model="article.introduction"
            rows="3"
            name="introduction"
            autosize
            label="文章简介"
            type="textarea"
            maxlength="300"
            placeholder="请输入简介"
            show-word-limit
            :rules="[{ required: true, message: '请填写简介' }]"
        />
        <md-editor
            theme="dark"
            v-model="article.markdown"
            :toolbars="toolbars"
            :preview="false"
            @onUploadImg="uploadImage"
            @onHtmlChanged="onHtmlChanged"
        >
        </md-editor>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button :loading="publishing" loading-text="正在保存..." round block type="primary" native-type="submit">
          保存
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import _ from "lodash";
import {handleUploadResponse, success, warning} from "@/common";

export default {
  name: "PublishArticleView",
  data() {
    return {
      article: {},
      publishing: false,
      tagLoading: true,
      toolbars: [
        'bold',
        'underline',
        'italic',
        'image',
        'strikeThrough',
        '-',
        'quote',
        'unorderedList',
        'orderedList',
        '-',
        'codeRow',
        'code',
        'link',
        'table',
        '=',
        'prettier',
        'pageFullscreen',
        'preview',
        'catalog',
      ],
      tags: [],
      showTag: false,
    }
  },
  components: {MdEditor},
  async mounted() {
    await this.loadTags();
  },
  methods: {
    /**
     * 返回
     * */
    back() {
      history.back();
    },
    /**
     * 保存文章
     * */
    async publish(values) {
      if (_.isEmpty(this.article.markdown)) {
        warning("请填写文章正文");
        return;
      }
      if (_.isEmpty(this.article.blogContents)) {
        warning("没有检测到文章正文")
        return;
      }
      this.publishing = true;
      values.markdown = this.article.markdown;
      values.blogContents = this.article.blogContents;
      let formData = new FormData();
      for (let item in values) {
        formData.append(item, values[item]);
      }
      let response = await fetch("/Article/Publish", {
        method: "post",
        body: formData
      });
      let that = this;
      await this.$handleResponse(response,() => that.publishing = false);
      success("保存成功，正在跳转文章列表");
      this.publishing = false;
      await this.$router.push({name: "article"});
    },
    /**
     * 选择标签
     * */
    pickTag(selected) {
      this.showTag = false;
      this.article.tags = selected.selectedOptions[0].text;
    },
    /**
     * 上传文章相关图片
     * @param {File[]} files 选择的图片
     * @param {function(string[])} callback 上传成功后的回调函数
     * */
    async uploadImage(files, callback) {
      if (files.length <= 0) {
        warning("请选择图片")
        return;
      }

      let file = files[0];
      if (!file.type.startsWith("image")) {
        warning("请选择图片上传")
        return;
      }

      let formData = new FormData();
      formData.append("image", file);

      let response = await fetch("/Article/Upload",
          {
            method: "post",
            body: formData
          });
      let url = await handleUploadResponse(response);
      callback([url]);
    },
    /**
     * 保存编辑器html内容
     * */
    onHtmlChanged(html) {
      this.article.blogContents = html;
    },
    /**
     * 加载标签选项
     * */
    async loadTags() {
      let response = await fetch(`/Article/Tags`);
      let result = await this.$handleResponse(response);
      let tags = [];
      for (let item of result) {
        tags.push({text: item, value: item});
      }
      this.tags = tags;
      this.tagLoading = false;
    },
    /**
     * 取消选择标签
     * */
    async cancelPick(){
      this.showTag = false;
      this.tag = "";
    }
  }
}
</script>

<style scoped>

</style>