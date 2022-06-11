<template>
  <section class="child_page">
    <head-top crossover=""></head-top>
    <section class="child_wrapper">
      <section class="desc">
        输入验证码
        <div>当前手机号码+86{{phoneNum}}</div>
      </section>
      <section class="form">
        <van-password-input :value="captcha" :length="4" :gutter="10" :mask="false" :focused="showKeyboard"
          @focus="inputFocus" />
        <van-number-keyboard v-model="captcha" :show="showKeyboard" @blur="showKeyboard = false" safe-area-inset-top />
        <van-button round block type="primary" :disabled="!!timer" class="submit-btn" @click="resetPassCaptcha">
          重新发送{{timer ? time+'s' : ''}}
        </van-button>
      </section>
    </section>
    <transition name="router-show">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import headTop from '@/components/header/head.vue';
export default {
  data() {
    return {
      phoneNum: "",
      captcha: "",
      showKeyboard: true,
      time: 60,
      timer: null
    }
  },
  components: { headTop },
  mounted() {
    this.phoneNum = this.$route.query.phoneNum;
    this.showInterval();
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
  },
  watch: {
    captcha(newVal) {
      if (newVal.length > 3) {
        this.$api.checkCaptcha({ phoneNum: this.phoneNum, captcha: newVal }).then(res => {
          if (res.code == '0') {
            this.$router.push({
              path: "/login/reset",
              query: {
                phoneNum: this.phoneNum
              }
            })
          }
        })
      } else {
        this.$toast.fail(res.msg);
        return ""
      }
    }
  },
  methods: {
    showInterval() {
      let that = this;
      if (that.timer) {
        window.clearInterval(that.timer);
        that.timer = null;
      }
      let time = 630;
      let timer = setInterval(() => {
        if (time > 1) {
          time--;
          that.time = time
        } else {
          window.clearInterval(that.timer);
          that.timer = null;
          that.time = 60
        }
      }, 1000);
      that.timer = timer
    },
    inputFocus(e, f) {
      this.showKeyboard = true;
    },
    resetPassCaptcha() {
      this.$api.resetPassCaptcha({ phoneNum: this.phoneNum }).then(res => {
        this.$toast(res.msg)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
.child_wrapper{
  padding: .386473rem;
  box-sizing: border-box;
  .desc{
    font-size: .57971rem;
    font-weight: bold;
    padding-top: 1.449275rem;
    padding-bottom: .724638rem;
  }
  .van-cell{
    padding: .483092rem 0;
  }
  .van-cell::after{
    left: 0;
    right: 0;
    border-color: $gray1;
  }
  .submit-btn{
    margin: .797101rem auto;
    height: auto;
    border: 0;
  }
  .submit-btn .van-button__text{
    font-size: .434783rem;
    font-weight: bold;
    padding: .321981rem 0 .330193rem;
  }
  .van-button--disabled{
    opacity: .6;
  }
}

</style>