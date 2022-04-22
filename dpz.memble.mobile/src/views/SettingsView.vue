<template>
  <van-nav-bar title="基础设置"/>
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

      <van-tab title="退出">
        <div class="content">
          <van-button type="primary" size="large" :loading="signOuting" @click="signOut">退出账号</van-button>
        </div>
      </van-tab>

    </van-tabs>
  </van-skeleton>
</template>

<script>
import {Notify, Toast, Dialog} from "vant";

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
      userInfo: {
        // avatar: "https://localhost:37701/Home/Image/625e9fa9dd0b89c478183cb9",
        // enable: false,
        // id: "pengqian",
        // key: "7451894ca9ca4b0b85f57d07989523d2",
        // lastAccessTime: "2022-04-06T14:03:35",
        // name: "被打断de狗腿",
        // permissions: 2,
        // sex: "0",
        // sign: "社恐的阿胖"
      },
      pwd: {}
    };
  },
  mounted() {
    this.$nextTick(async function () {
      let that = this;

      let response = await fetch("https://localhost:37701/account/GetUserInfo");
      that.isLoading = false;
      if (response.ok) {
        let data = await response.json();
        that.userInfo = data.data;
        that.userInfo.sex = data.data.sex.toString();
      } else {
        Notify({type: "warning", message: response.statusText});
      }

    });
  },
  methods: {
    back() {
      history.back()
    },
    async saveInfo(values) {
      let formData = new FormData();
      for (let item in values) {
        formData.append(item, values[item]);
      }
      this.saving = true;
      try {
        let response = await fetch("/account/UpdateInfo", {
          method: "post",
          body: formData
        });
        if (response.ok) {
          let data = await response.json();
          if (data.success) {
            Notify({type: 'primary', message: 'success'});
          } else {
            Notify({type: 'warning', message: data.msg});
          }
        } else {
          Notify({type: "warning", message: response.statusText});
        }
      } catch (e) {
        Notify({type: "warning", message: e.toString()});
      }
      this.saving = false;
    },
    async changePassword(values) {
      this.changing = true;
      let formData = new FormData();
      for (let item in values) {
        formData.append(item, values[item]);
      }
      try {
        let response = await fetch("/account/ChangePassword", {
          method: "post",
          body: formData
        });
        if (response.ok) {
          let data = await response.json();
          if (data.success) {
            Notify({type: 'primary', message: 'success'});
          } else {
            Notify({type: 'warning', message: data.msg});
          }
        } else {
          Notify({type: "warning", message: response.statusText});
        }
      } catch (e) {
        Notify({type: "warning", message: e.toString()});
      }

      this.pwd = {};
      this.changing = false;

    },

    /*
    * 上传头像前的校验
    * */
    uploadAvatarBefore(file) {
      console.log(file);
      if (!file.type.startsWith("image")) {
        Toast('请上传图片');
        return false;
      }
      return true;
    },

    /**
     * 上传头像
     * @param {File} file
     * */
    async uploadAvatar(file) {
      this.uploading = true;
      let formData = new FormData();
      formData.append("avatar", file);
      let response = await fetch("/account/UpdateAvatar", {
        method: "post",
        body: formData
      });
      if (response.ok) {
        let data = await response.json();
        if (data.success) {
          this.userInfo.avatar = data.data;
          Notify({type: "primary", message: "头像更新成功"});
        } else {
          Notify({type: "warning", message: data.msg});
        }
      } else {
        Notify({type: "warning", message: response.statusText});
      }
      this.uploading = false;
    },

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
        Notify({type: "warning", message: response.statusText});
      }
      this.signOuting = false;
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