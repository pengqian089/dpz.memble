<template>
  <van-nav-bar title="基础设置" left-text="首页" left-arrow @click-left="toHome"/>
  <van-skeleton row="5" :loading="isLoading">
    <van-tabs v-model:active="active">
      <van-tab title="我的资料">
        <van-form @submit="saveInfo" class="content">
          <van-cell-group inset>
            <van-field
                v-model="userInfo.id"
                name="id"
                label="账号"
                placeholder="账号"
                readonly
                :rules="[{ required: true, message: '账号怎么不见了？' }]"
            />
            <van-field
                v-model="userInfo.name"
                name="name"
                label="昵称"
                placeholder="昵称"
                :rules="[{ required: true, message: '请填写昵称' }]"
            />
            <van-field name="sex" label="性别" :rules="[{ required: true, message: '请选择性别' }]">
              <template #input>
                <van-radio-group v-model="userInfo.sex" direction="horizontal">
                  <van-radio name="0">男</van-radio>
                  <van-radio name="1">女</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
                v-model="userInfo.sign"
                rows="5"
                name="sign"
                autosize
                label="签名"
                type="textarea"
                maxlength="300"
                placeholder="请输入留言"
                show-word-limit
            />
          </van-cell-group>
          <div style="margin: 16px;">
            <van-button :loading="saving" loading-text="正在保存..." round block type="primary" native-type="submit">
              保存
            </van-button>
          </div>
        </van-form>

      </van-tab>

      <van-tab title="头像">
        <div class="content" style="text-align: center">
          <van-uploader :before-read="uploadAvatarBefore" :after-read="uploadAvatar">
            <van-button icon="plus" type="primary" :loading="uploading" loading-text="正在上传...">上传头像</van-button>
          </van-uploader>
          <div class="content">
            <van-image :src="userInfo.avatar"
                       round
                       width="10rem"
                       height="10rem">
              <template v-slot:loading>
                <van-loading type="spinner" size="20"/>
              </template>
            </van-image>
          </div>

        </div>
      </van-tab>

      <van-tab title="密码">
        <van-form @submit="changePassword" class="content">
          <van-cell-group inset>
            <van-field
                v-model="pwd.nowpass"
                name="nowpass"
                label="原始密码"
                placeholder="原始密码"
                type="password"
                :rules="[{ required: true, message: '请输入原始密码' }]"
            />
            <van-field
                v-model="pwd.pass"
                name="pass"
                label="新密码"
                placeholder="新密码"
                type="password"
                :rules="[{ required: true, message: '请输入新密码' }]"
            />
            <van-field
                v-model="pwd.repass"
                name="repass"
                label="确认新密码"
                placeholder="确认新密码"
                type="password"
                :rules="[{ required: true, message: '请输入确认新密码' }]"
            />
          </van-cell-group>
          <div style="margin: 16px;">
            <van-button round block type="primary" :loading="changing" loading-text="正在修改..." native-type="submit">
              修改密码
            </van-button>
          </div>
        </van-form>

      </van-tab>

      <van-tab title="解绑二次验证">
        <van-form @submit="unbindTwoFactor" class="content">
          <van-cell-group inset>
            <van-field
                v-model="pinCode"
                name="id"
                label="PIN码"
                maxlength="6"
                placeholder="PIN码"
                :rules="[{ required: true, message: '请输入PIN码' }]"
            />
          </van-cell-group>
          <div style="margin: 16px;">
            <van-button :loading="unbinding" loading-text="正在解绑..." round block type="primary" native-type="submit">
              解绑
            </van-button>
          </div>
        </van-form>

      </van-tab>

      <van-tab title="退出">
        <div class="content">
          <van-button type="primary" size="large" :loading="signOuting" @click="signOut">退出账号</van-button>
        </div>
      </van-tab>

    </van-tabs>
  </van-skeleton>
</template>

<script>
import {Dialog, Toast} from "vant";
import {success, warning} from "@/common";

export default {
  name: "SettingsView",
  data() {
    return {
      isLoading: true,
      saving: false,
      uploading: false,
      changing: false,
      signOuting: false,
      active: 0,
      userInfo: {},
      pwd: {},
      unbinding: false,
      pinCode: ""
    };
  },
  mounted() {
    this.$nextTick(async function () {
      await this.getUserInfo();
    });
  },
  methods: {
    /**
     * 保存用户信息
     * */
    async saveInfo(values) {
      let formData = new FormData();
      for (let item in values) {
        formData.append(item, values[item]);
      }
      this.saving = true;
      let response = await fetch("/account/UpdateInfo", {
        method: "post",
        body: formData
      });
      let that = this;
      await this.$handleResponse(response, () => that.saving = false);
      success("信息更新成功");
      this.saving = false;
    },
    /**
     * 修改密码
     * */
    async changePassword(values) {
      this.changing = true;
      let formData = new FormData();
      for (let item in values) {
        formData.append(item, values[item]);
      }
      let response = await fetch("/account/ChangePassword", {
        method: "post",
        body: formData
      });
      let that = this;
      await this.$handleResponse(response, () => that.changing = false);
      success("密码修改成功");
      this.pwd = {};
      this.changing = false;
    },
    /*
    * 上传头像前的校验
    * @param {File} file
    * */
    uploadAvatarBefore(file) {
      if (!file.type.startsWith("image")) {
        Toast('请上传图片');
        return false;
      }
      return true;
    },
    /**
     * 上传头像
     * */
    async uploadAvatar(file) {
      this.uploading = true;
      let formData = new FormData();
      formData.append("avatar", file.file);
      let response = await fetch("/account/UpdateAvatar", {
        method: "post",
        body: formData
      });

      let that = this;
      this.userInfo.avatar = await this.$handleResponse(response, () => that.uploading = false);
      this.uploading = false;
      success("头像更新成功");
    },
    /**
     * 退出账号
     * */
    async signOut() {
      await Dialog.confirm({
        title: '提示',
        message:
            '确定要退出账号吗？',
      });

      this.signOuting = true;
      let response = await fetch("/account/LogOut", {method: "post"});
      if (response.ok) {
        location.href = "/";
      } else {
        warning(response.statusText);
      }
      this.signOuting = false;
    },
    /**
     * 获取用户信息
     * */
    async getUserInfo() {
      this.isLoading = true;
      let response = await fetch("/account/GetUserInfo");
      let that = this;
      this.userInfo = await this.$handleResponse(response, () => that.isLoading = false);
      this.userInfo.sex = this.userInfo.sex.toString();
      this.isLoading = false;
    },
    /**
     * 回到首页
     * */
    toHome() {
      location.href = "/";
    },
    /*
    * 解绑二次验证
    * */
    async unbindTwoFactor() {
      let formData = new FormData();
      formData.append("pinCode", this.pinCode);
      this.unbinding = true;
      let response = await fetch("/unbind-two-factor", {
        method: "post",
        body: formData
      });
      let that = this;
      function clear(){
        that.pinCode = "";
        that.unbinding = false;
      }
      await this.$handleResponse(response, () => clear());
      success("解绑成功");
      clear();
    }
  }
}
</script>

<style scoped>
.content {
  margin-top: 1em;
}

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