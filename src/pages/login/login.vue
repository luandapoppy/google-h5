<template>
  <div class="page">
    <div class="bg bg-top"><img src="./image/top.png" alt=""></div>
    <div class="bg bg-left"><img src="./image/left.png" alt=""></div>
    <!-- <div class="bg bg-bottom"><img src="./image/bottom.png" alt=""></div> -->
    <section>
      <div class="title">
        欢迎{{type=='2'?'注册/':''}}登录快数
      </div>
      <div class="sub-title">
        <span v-show="type=='2'">新用户登录后将自动创建账号</span>
      </div>
    </section>
    <section class="form">
      <van-form @submit="onSubmit" validate-first>
        <van-field v-model="form.phoneNum" name="手机号码" label="+86" type="tel" placeholder="请输入手机号码" />
        <van-field v-show="type=='1'" v-model="form.password" name="密码" label="" :type="passwordShow ? '':'password'"
          placeholder="请输入密码" :right-icon="passwordShow?'eye-o':'closed-eye'" @click-right-icon="changePasswordShow">
        </van-field>
        <van-field v-show="type=='2'" v-model="form.captcha" name="验证码" label="" placeholder="请输入验证码">
          <template #button>
            <div v-if="!timer" class="vcode-btn" :disabled="form.phoneNum.length < 11" @click="sendCaptcha">发送验证码
            </div>
            <div v-if="timer" class="vcode-btn">{{time}}s后获取</div>
          </template>
        </van-field>
        <div v-model="form.isAgree" class="agree">登录注册即表示同意
          <router-link to="/login/protocol/yhfwxy">用户服务协议</router-link>
        </div>
        <div>
          <van-button round block type="primary" native-type="submit" :disabled="disabled" class="submit-btn">立即登录
          </van-button>
        </div>
        <div class="login-type">
          <span @click="changeType">{{type=='1'?'验证码登录':'密码登录'}}</span>
          <span v-if="type=='1'" style="float: right" @click="forgetPassword">忘记密码</span>
        </div>
      </van-form>
    </section>
    <!-- <section class="other-login">
      <van-divider>其他方式登录</van-divider>
    </section> -->
    <transition name="router-show">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import MobileDetect from 'mobile-detect';
import { setStore, clearStore } from "@/config/mUtil.js"
import { versionNo } from "@/config/env.js"
export default {
  data() {
    return {
      form: {
        phoneNum: "",
        captcha: "",
        password: "",
        isAgree: false
      },
      type: "1", //2验证码登录 1密码登录
      passwordShow: false,
      timer: null,
      time: 60
    }
  },
  computed: {
    disabled() {
      const { phoneNum, captcha, password } = this.form;
      return !(phoneNum.length > 10 && (captcha.length > 3 || password.length > 0))
    }
  },
  methods: {
    sendCaptcha() {
      const { phoneNum } = this.form;
      if (phoneNum.length > 10) {
        const that = this;
        this.$toast.loading({
          message: '加载中',
          forbidClick: true,
          duration: 0
        });
        this.$api.sendCaptcha(
          {
            phoneNum: phoneNum,
            templateType: '02'
          }).then((e) => {
            this.$toast.clear();
            if (e.code == '0') {
              let time = 60;
              let timer = setInterval(() => {
                if (time > 1) {
                  time--;
                  that.time = time
                } else {
                  clearInterval(timer);
                  that.timer = null;
                  that.time = 60
                }
              }, 1000);
              that.timer = timer
            } else {
              this.$toast.fail({
                message: e.msg
              })
            }
          })
          .catch(e => {
            this.$toast.clear();
          })
      }
    },
    changePasswordShow() {
      this.passwordShow = !this.passwordShow;
    },
    onSubmit() {
      this.$api.login({
        loginType: this.type,
        ...this.form
      }).then(res => {
        if (res.code == '0') {
          // 退出登录清除缓存
          clearStore();
          let data = res.data;

          // 遗留：若为注册用户 "hasPassword":false 》创建密码》首页 提示加入学校
          // 若已认证，默认选中第一个学生成员 遗留： 否则选择第一位非教师成员（教师功能未完成）
          const currentMember = data.members.find(item => item.certifiedType == '0');
          // 缓存用户信息
          setStore('token', data.token);
          setStore('userProfile', data.userProfile);
          // vuex监听
          this.$store.dispatch("member/changeCurrentMember", currentMember);
          this.$store.dispatch("member/changeMembers", data.members);

          this.$router.push("/my");

          // 应用版本校验
          const md = new MobileDetect(window.navigator.userAgent);
          let appType = '1';
          let phoneSystemVersion;
          if (md.os() == 'iOS') {
            appType = '2'
            phoneSystemVersion = md.version('iPhone');
          } else {
            phoneSystemVersion = md.version("Android");
          }
          const phoneBrand = md.mobile();

          // 应用启动必要数据
          this.$api.getAppInitData({ appType, versionNo, phoneBrand, phoneSystemVersion }).then(req => {
            const initData = req.data;
            if (initData.appVersionCheckResult.hasNewestVersion == "true") {
              this.$toast("有新版本啦")
            }
            setStore("openSportDictResult", initData.openSportDictResult);
            setStore("commonParamResult", initData.commonParamResult);
            setStore("publicNoticeResult", initData.publicNoticeResult);

            // 将运动须知和运动道具列表转化为对象形式 便于取值
            let sportNoticeAndPropsResultObj = {};
            for (const notice of initData.sportNoticeAndPropsResult) {
              sportNoticeAndPropsResultObj[notice.id] = notice;
            }
            setStore("sportNoticeAndPropsResult", sportNoticeAndPropsResultObj);
          })
        } else {
          this.$toast.fail({
            message: res.msg,
          })
        }
      })
    },
    changeType() {
      this.type = this.type == '1' ? '2' : '1';
    },
    forgetPassword() {
      this.$router.push("/login/forget")
    }
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
.page{
  padding:2.415459rem 1.086957rem 0;
  height: 100%;
  box-sizing: border-box;
  .bg{
    position: absolute;
  }
  .bg-top{
    right:0;
    top:0;
    @include widthHeight(4.10628rem, 4.10628rem);
    overflow: hidden;
    img{
      width: 8.21256rem;
      height: auto;
      transform: translateY(-50%);
    }
  }
  .bg-left{
    left:0;
    top:11.835749rem;
    @include widthHeight(4.492754rem, auto);
    transform: translateX(-68%);
    img{
      width: 100%;
    }
  }
  .bg-bottom{
    bottom:0;
    left:0;
    right:0;
    img{
      width: 100%;
    }
  }
  
}
.title{
  color: $black1;
  font-size: .748792rem;
  font-weight: bold;
  margin-bottom: .362319rem;
}
.sub-title{
  font-size: .338164rem;
  color: $black1;
  height: .338164rem;
  margin-bottom: .483092rem;
}
div /deep/ .van-field__label{
  width: auto;
  font-size: .386473rem;
  color: $black1;
  padding-right: .241546rem;
  border-right: .007971rem solid $black1;
  margin-right: .241546rem;
}
div /deep/ .van-field__control{
  font-size: .386473rem;
  color: $black1;
}
.van-cell{
  padding: .483092rem 0;
}
.van-cell::after{
  left: 0;
  right: 0;
  border-color: $gray1;
}
.vcode-btn{
  border: 0;
  color: $maincolor;
  font-size: .386473rem;
}
.vcode-btn[disabled='disabled']{
  color: $black3;
}
div /deep/ input::-webkit-input-placeholder{
  color: $black3;
  font-size: .386473rem;
}
.password-icon{
  font-size: .483092rem;
}
.agree{
  margin-top: .362319rem;
  color: #8E8E8E;
}
.submit-btn{
  height: auto;
  @include bglinear(#FFC53D,$maincolor);
  margin: .797101rem auto;
  border: 0;
}
.submit-btn .van-button__text{
  font-size: .434783rem;
  font-weight: bold;
  padding: .394444rem 0 .386473rem;
}
.van-button--disabled{
  opacity: .6;
}
.login-type{
  color: $black1;
  font-size: .338164rem;
}
.other-login{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 4.468599rem;
  padding:0 1.086957rem;
}
@media screen and (max-height: 12.077295rem) {
  .bg-bottom{
    width: 100%;
    top: 12.077295rem !important;
    bottom: auto !important;
    height: 3.743961rem;
  }
  .other-login {
    display: block;
    position: initial;
    width: 100%;
    height: 3.743961rem;
  }
}
</style>