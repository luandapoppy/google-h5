<template>
  <section class="child_page">
    <head-top crossover="找回登陆密码"></head-top>
    <section class="child_wrapper">
      <section class="desc"> 输入原手机号</section>
      <section class="form">
        <van-field v-model="phoneNum" name="手机号码" label="+86" type="tel" placeholder="请输入手机号码" />
        <van-button round block type="primary" :disabled="phoneNum.length<11" class="submit-btn" @click="submit">下一步
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
      phoneNum: ""
    }
  },
  components: { headTop },
  methods: {
    submit() {
      this.$api.resetPassCaptcha({ phoneNum: this.phoneNum }).then(res => {
        if (res.code == '0') {
          this.$router.push({
            path: "/login/captcha",
            query: {
              phoneNum: this.phoneNum
            }
          })
        } else {
          this.$toast.fail({ message: res.msg })
        }
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