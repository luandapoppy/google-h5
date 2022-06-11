<template>
  <section class="child_page">
    <head-top crossover="找回登录密码"></head-top>
    <section class="child_wrapper">
      <section class="desc">
        重置密码
        <!-- <div>当前手机号码+86{{phoneNum}}</div> -->
      </section>
      <van-form class="form" ref="form" validate-trigger="onSubmit" :show-error="false" :show-error-message="false">
        <van-field v-model="password" name="密码" label="" :type="passwordShow ? '':'password'" placeholder="输入长度6-16位密码"
          @click-left-icon="changePasswordShow" :left-icon="passwordShow?'eye-o':'closed-eye'" :rules="[{ validator }]">
        </van-field>
        <van-field v-model="password2" name="密码" label="" :type="passwordShow2 ? '':'password'" placeholder="重新输入密码"
          @click-left-icon="changePasswordShow2" :left-icon="passwordShow2?'eye-o':'closed-eye'"
          :rules="[{ validator:validator2 }]">
        </van-field>
        <van-button round block type="primary" native-type="submit" class="submit-btn" @click="resetPassword">
          保存
        </van-button>
      </van-form>
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
      password: "",
      password2: "",
      passwordShow: false,
      passwordShow2: false
    }
  },
  components: { headTop },
  mounted() {
    this.phoneNum = this.$route.query.phoneNum;
  },
  methods: {
    validator(val) {
      if (/^.{6,16}$/.test(val)) {
        return true
      } else {
        this.$toast("输入长度6-16位密码")
        return false
      }
    },
    validator2(val) {
      if (val == this.password) {
        return true
      } else {
        this.$toast("两次密码输入不一致");
        return false
      }
    },
    changePasswordShow() {
      this.passwordShow = !this.passwordShow;
    },
    changePasswordShow2() {
      this.passwordShow2 = !this.passwordShow2;
    },
    resetPassword() {
      this.$refs.form.validate().then(() => {
        this.$api.resetPassCaptcha({ phoneNum: this.phoneNum, password: this.password }).then(res => {
          if (res.code == '0') {
            this.$router.push("/login")
          } else {
            this.$toast(res.msg);
          }
        })
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
    /deep/ .van-field__left-icon{
      margin-right: .338164rem;
    }
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