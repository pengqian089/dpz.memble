<template>
  <van-nav-bar left-text="返回" left-arrow title="发表文章" @click="back"/>
  <div style="padding:0.5em">
    <van-form @submit="publish" class="content">
      <van-cell-group inset>
        <van-field
            v-model="article.blogTitle"
            name="title"
            label="标题"
            placeholder="标题"
            :rules="[{ required: true, message: '请输入标题' }]"
        />
        <van-field
            v-model="article.tag"
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
              :loading="tagLoading"
              @cancel="showTag = false"
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
            name="sign"
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
import {Notify} from "vant";
import MdEditor from "md-editor-v3";
import "md-editor-v3/lib/style.css";

export default {
  name: "PublishArticleView",
  components: {MdEditor},
  data() {
    return {
      id:null,
      article: {},
      publishing: false,
      tagLoading : true,
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
      showTag: false
    }
  },
  async mounted() {
    this.id = this.$route.params.id;
    let response = await fetch(`https://localhost:37701/Article/Detail/${this.id}`);
    if(response.ok){
      let result = await response.json();
      if(result.success){
        this.article = result.data;
      }else{
        Notify({type:"warning",message:result.msg});
      }
    }else{
      Notify({type:"warning",message:response.statusText});
    }
    await this.loadTags();
  },
  methods: {
    back() {
      history.back();
    },
    publish(values) {
      if (typeof (this.article.markdown) === "undefined" || this.article.markdown.length === 0) {
        Notify({type: "warning", message: "请填写正文嗷"})
        return;
      }
      values.markdown = this.article.markdown;
      values.blogContents = this.article.blogContents;
      console.log(values);
    },
    pickTag(selected) {
      this.showTag = false;
      this.article.tag = selected.selectedOptions[0].text;
    },
    async uploadImage(files, callback) {
      console.log(files);
      console.log(callback);
      if (files.length <= 0) {
        Notify({type: "warning", message: "请选择图片"});
        return;
      }

      let file = files[0];
      if (!file.type.startsWith("image")) {
        Notify({type: "warning", message: "请选择图片上传"});
        return;
      }

      let formData = new FormData();
      formData.append("image", file);

      let response = await fetch("/Article/Upload",
          {
            method: "post",
            body: formData
          });
      if (response.ok) {
        let result = await response.json();
        if (result.success === 1) {
          console.log(result.data);
          callback([result.url]);
        } else {
          Notify({type: "warning", message: result.message});
        }
      } else {
        Notify({type: "warning", message: response.statusText});
      }

      callback(["https://localhost:37701/Home/Image/61a66bf487022a55ce3f9d3e?width=1170&height=658&cache=True"]);
    },
    onHtmlChanged(html){
      this.article.blogContents = html;
    },
    async loadTags(){
      let response = await fetch(`https://localhost:37701/Article/Tags`);
      if(response.ok){
        let result = await response.json();
        if(result.success){
          for (let item of result.data) {
            this.tags.push({text:item,value:item});
          }
        }else{
          Notify({type:"warning",message:result.msg});
        }
      }else{
        Notify({type:"warning",message:response.statusText});
      }
      this.tagLoading = false;
    }
  }
}
</script>

<style scoped>

</style>