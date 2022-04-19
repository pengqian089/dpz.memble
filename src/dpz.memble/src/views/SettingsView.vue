<template>
  <h1 class="page-title">基本设置</h1>
  <el-tabs type="border-card">
    <el-tab-pane label="我的资料">
      <el-form :model="form" label-width="120px">
        <el-form-item label="账号">
          <el-col :span="8">
            <el-input v-model="form.id" readonly/>
          </el-col>
          <el-col :span="5">
            账号不能更改
          </el-col>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"/>
            <el-radio label="女"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签名">
          <el-input v-model="form.sign" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="infoLoading">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="头像">
      <div class="avatar-upload">
        <el-upload action="/account/UpdateAvatar" name="avatar"
                   :before-upload="avatarBeforeUpload"
                   :on-success="avatarUploadSuccess"
                   :on-error="avatarUploadError"
                   :disabled="avatarUploading">
          <el-button type="primary" :icon="UploadFilled" :loading="avatarUploading">
            {{ this.avatarUploading ? "正在上传" : "上传头像" }}
          </el-button>
        </el-upload>
        <p>建议尺寸200*200，支持各种格式图片</p>
        <img :src="avatarSrc" alt="avatar"/>
      </div>
    </el-tab-pane>
    <el-tab-pane label="密码">密码</el-tab-pane>
    <el-tab-pane label="退出">退出</el-tab-pane>
  </el-tabs>
</template>

<script>
import {reactive} from 'vue';
import {UploadFilled} from "@element-plus/icons-vue";
import {ElMessage} from 'element-plus'

export default {
  name: "SettingsView",
  data() {
    return {
      form: reactive({
        id: "pengqian",
        name: '被打断的狗腿',
        sex: '男',
        sign: '社恐的阿胖',
      }),
      UploadFilled,
      avatarUploading: false,
      avatarSrc:"https://core.dpangzi.com/Home/Image/624d2d37be5b610cca58362f",
      infoLoading: false,
      rules: reactive({
        id: [
          {required: true, message: 'ID怎么没了？', trigger: 'blur'},
        ],
        name: [
          {
            required: true,
            name: '请输入昵称',
            trigger: 'change',
          },
        ],
        resource: [
          {
            required: true,
            message: '无性别？不允许！',
            trigger: 'change',
          },
        ]
      })
    };
  },
  mounted() {
    this.$nextTick(function () {
    });
  },
  methods: {
    async onSubmit() {
      console.log(this.form);
      let formData = new FormData();
      for(let item in this.form){
        formData.append(item,this.form[item]);
      }
      try {
        this.infoLoading = true;
        let response = await fetch("/account/UpdateInfo", {
          method: "post",
          body: formData
        });
        let data = await response.json();
        if (data.success) {
          ElMessage.success("信息更新成功");
        } else {
          ElMessage.error(data.msg);
        }
        console.log(data);
      } catch (e) {
        ElMessage.error(e);
      }
      this.infoLoading = false;
    },
    avatarBeforeUpload() {
      this.avatarUploading = true;
      console.log("开始上传");
    },
    avatarUploadSuccess(response) {
      this.avatarUploading = false;
      ElMessage.success("头像更换成功");
      if(response.success){
        this.avatarSrc = response.data;
      }
    },
    avatarUploadError(error) {
      this.avatarUploading = false;
      console.log(error);
      ElMessage.error(error.toString());
    }
  }
}
</script>

<style scoped>
.avatar-upload {
  width: 400px;
  height: 400px;
  background-color: #292b2b;
  margin: 0 auto;
  padding: 10px 0;
}

.avatar-upload img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 200px;
  height: 200px;
  margin: -50px 0 0 -84px;
  border-radius: 100%;
}
</style>