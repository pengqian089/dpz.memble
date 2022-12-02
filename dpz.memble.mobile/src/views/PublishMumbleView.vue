<template>
  <van-nav-bar title="发布碎碎念" left-arrow left-text="返回" @click="back"/>
  <div style="padding:0.5em">
    <div style="padding: 1em">
      <van-button :disabled="btnStartRecord" type="primary" @click="onRecord">
        {{btnStartRecordText}}
      </van-button>
      <van-button :disabled="btnPlay" type="primary" @click="onTogglePlay">
        {{btnPlayText}}
      </van-button>
      <van-button :disabled="btnClear" @click="onClear" type="primary">清除录音</van-button>
      <van-button :disabled="btnUpload" @click="onUploadAudio" type="primary">上传录音</van-button>
    </div>
    <van-form @submit="publish" class="content">
      <van-cell-group inset>
        <md-editor
            theme="dark"
            ref="editorRef"
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
import {success, warning, handleUploadResponse, record} from "@/common";

export default {
  name: "PublishMumbleView",
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
        'link',
        'table',
        '=',
        'prettier',
        'pageFullscreen'
      ],
      btnStartRecord: false,
      btnPlay: true,
      btnClear: true,
      btnUpload: true,
      btnStartRecordText:"开始录音",
      btnPlayText: "试听"
    }
  },
  components: {
    MdEditor
  },
  methods: {
    /**
     * 上传图片
     * */
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
    /**
     * 获取html内容
     * */
    onHtmlChanged(html) {
      this.mumble.htmlContent = html;
    },
    /**
     * 发布碎碎念
     * */
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
    /**
     * 返回
     * */
    back() {
      history.back();
    },
    /**
     * 开始录音
     * */
    async onRecord() {
      let that = this;
      if(this.btnStartRecordText === "开始录音"){
        await record.startRecord(() => {
          that.btnStartRecordText = "结束录音";
        });
      }else{
        record.endRecord(() => {
          that.btnStartRecord = true;
          that.btnPlay = false;
          that.btnClear = false;
          that.btnUpload = false;
          that.btnStartRecordText = "开始录音";
        });
      }

    },
    onTogglePlay() {
      let that = this;
      if(this.btnPlayText === "试听" || this.btnPlayText === "继续播放"){
        record.playAudio(() =>{
          that.btnPlayText = "暂停";
          that.btnStartRecord = true;
          that.btnPlay = false;
          that.btnClear = true;
          that.btnUpload = true;
        },() =>{
          that.btnPlayText = "试听";
          that.btnStartRecord = true;
          that.btnPlay = false;
          that.btnClear = false;
          that.btnUpload = false;
        });
      }else{
        record.pauseAudio(() =>{
          that.btnPlayText = "继续播放";
          that.btnStartRecord = true;
          that.btnPlay = false;
          that.btnClear = true;
          that.btnUpload = true;
        });
      }
    },
    onClear(){
      let that = this;
      record.clearAudio(() =>{
        that.btnStartRecord = false;
        that.btnPlay = true;
        that.btnClear = true;
        that.btnUpload = true;
      });
    },
    async onUploadAudio(){
      let that = this;
      let result = await record.uploadAudio(() => {
        that.btnStartRecord = false;
        that.btnPlay = true;
        that.btnClear = true;
        that.btnUpload = true;
      });


      this.$refs.editorRef.insert(() => {
        return {
          targetValue: `<audio controls src="${result["accessUrl"]}" preload="metadata"></audio>`,
          select: true,
          deviationStart: 0,
          deviationEnd: 0
        };
      });

      console.log(result);
    }
  }
}
</script>

<style scoped>

</style>