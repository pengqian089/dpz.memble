<template>
  <van-nav-bar title="修改时间轴" left-arrow left-text="返回" @click="back"/>
  <div style="padding:0.5em">
    <van-form @submit="publish" class="content">
      <van-cell-group inset>
        <van-field
            v-model="timeline.title"
            name="title"
            label="标题"
            placeholder="标题"
            :rules="[{ required: true, message: '请输入标题' }]"
        />
        <van-field
            v-model="timeline.more"
            name="more"
            label="添加链接"
            placeholder="链接"
        />
        <van-field
            v-model="timeline.date"
            is-link
            readonly
            name="date"
            label="时间轴节点"
            placeholder="点击选择时间轴节点"
            @click="showDate = true"
            :rules="[{ required: true, message: '请选择时间轴节点' }]"
        />
        <van-popup v-model:show="showDate" position="bottom">
          <van-date-picker @confirm="pickDate" @cancel="cancelPickDate"/>
        </van-popup>
        <md-editor
            theme="dark"
            v-model="timeline.content"
            :toolbars="toolbars"
            :preview="false"
            @onUploadImg="uploadImage"
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
import {success, warning,handleUploadResponse} from "@/common";
import dayjs from "dayjs";

export default {
  name: "EditTimelineView",
  components: {MdEditor},
  data() {
    return {
      id: null,
      timeline: {},
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
      showDate: false
    }
  },
  async mounted() {
    let id = this.$route.params.id;
    if (_.isEmpty(id)) {
      warning("缺少参数");
      return;
    }
    this.id = id;
    await this.getTimeline();
  },
  methods: {
    async getTimeline() {
      let response = await fetch(`https://localhost:37701/Timeline/Detail/${this.id}`);
      this.timeline = await this.$handleResponse(response);
      this.timeline.date = dayjs(this.timeline.date).format("YYYY/MM/DD");
    },
    async publish(values) {
      let that = this;
      this.publishing = true;
      values.content = this.timeline.content || "";
      values.id = this.id;

      let formDate = new FormData();
      for (let item in values) {
        formDate.append(item, values[item]);
      }
      let response = await fetch("/Timeline/Publish", {
        method: "post",
        body: formDate
      });
      await this.$handleResponse(response, () => that.publishing = false);
      success("修改成功，正在跳转至时间轴列表");
      this.publishing = false;
      await this.$router.push({name: "timeline"});
    },
    async uploadImage(files,callback) {
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

      let response = await fetch("/Timeline/Upload",
          {
            method: "post",
            body: formData
          });
      let url = await handleUploadResponse(response);
      callback([url]);
    },
    pickDate(selected) {
      this.timeline.date = selected.selectedValues.join("/");
      this.showDate = false;
    },
    cancelPickDate() {
      this.timeline.date = '';
      this.showDate = false;
    },
    back() {
      history.back();
    }
  }
}
</script>

<style scoped>

</style>