<template>
  <van-nav-bar title="修改碎碎念" left-arrow left-text="返回" @click="back"/>
  <div style="padding:0.5em">
    <van-form @submit="publish" class="content">
      <van-cell-group inset>
        <md-editor
            theme="dark"
            v-model="mumble.markdown"
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
import {success, warning, handleUploadResponse} from "@/common";

export default {
  name: "EditMumbleView",
  data() {
    return {
      id: null,
      mumble: {},
      publishing: false,
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
    }
  },
  components: {
    MdEditor
  },
  async mounted() {
    let id = this.$route.params.id;
    if (_.isEmpty(id)) {
      warning("缺少参数");
      return;
    }
    this.id = id;
    await this.loadMumble();
  },
  methods: {
    async loadMumble() {
      let response = await fetch(`/Talk/Detail/${this.id}`);
      this.mumble = await this.$handleResponse(response);
    },
    async uploadImage(files, callback) {
      if (files.length <= 0) {
        warning("请选择图片");
        return;
      }
      let file = files[0];
      if (!file.type.startsWith("image")) {
        warning("请选择图片上传");
        return;
      }

      let formData = new FormData();
      formData.append("image", file);

      let response = await fetch("/Talk/Upload",
          {
            method: "post",
            body: formData
          });
      let url = await handleUploadResponse(response);
      callback([url]);
    },
    onHtmlChanged(html) {
      this.mumble.htmlContent = html;
    },
    async publish() {
      this.publishing = false;
      if (_.isEmpty(this.mumble.markdown)) {
        warning("请输入碎碎念正文");
        return;
      }
      if (_.isEmpty(this.mumble.htmlContent)) {
        warning("没有检测到正文");
        return;
      }

      let formData = new FormData();
      formData.append("id", this.id);
      formData.append("markdown", this.mumble.markdown);
      formData.append("html", this.mumble.htmlContent);

      let response = await fetch("/Talk/Publish", {
        method: "post",
        body: formData
      });
      await this.$handleResponse(response);
      success("保存成功，正在跳转碎碎念列表");
      this.publishing = false;
      await this.$router.push({name: "mumble"});
    },
    back() {
      history.back();
    }
  }
}
</script>

<style scoped>

</style>