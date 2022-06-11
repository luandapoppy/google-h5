<template>
  <section class="child_page">
    <head-top ref="head" crossover="加入学校"></head-top>
    <section class="content">
      <div class="introduce">
        <div class="name">
          hi~ {{member.memberName}}
        </div>
        <div class="comment">
          欢迎您使用快数校内体育训练服务~
        </div>
      </div>
      <div class="steps">
        <div class="title">完成以下步骤加入学校:</div>
        <div class="step">1.请先向老师确认您的学校已入驻快数平台~</div>
        <div class="step">2.请选择加入方式</div>
        <div>
          <div class="step-card" @click="qrcodeClick">
            <i class="ks-icon ks-icon-scan"></i>
            <div class="detail">
              <div class="title">扫一扫(仅学生可扫码加入班级)</div>
              <div class="require">请先从老师那儿获取加入学校/班级二维码</div>
            </div>
          </div>
          <div class="step-card">
            <i class="ks-icon ks-icon-certify"></i>
            <div class="detail">
              <div class="title">身份认证(学生、老师均可使用)</div>
              <div class="require">请向老师确认快数平台里面有您的校内身份信息</div>
            </div>
          </div>
        </div>
      </div>
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
      member: {}
    }
  },
  components: { headTop },
  created() {
    const memberId = this.$route.query.memberId;
    this.member = this.$store.getters["member/getMembers"].find(item => item.memberId == memberId);
  },
  methods: {
    qrcodeClick() {
      this.$router.push({
        path: "/my/member/addschool/scan",
        query: {
          memberId: this.member.memberId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
header{
  background-color: $bgcolor3;
}
.content{
  padding-top: 1.3043rem;
  background-color: $bgcolor3;
}
.introduce{
  padding: 0 .3865rem;
  .name{
    @include sizeColor(.5797rem, $black1);
    font-weight: bold;
  }
  .comment{
    @include sizeColor(.3623rem, $black5);
    margin-top: .2415rem;
  }
}
.steps{
  padding: .4831rem .3865rem 0;
  margin-top: .4831rem;
  background-color: $white;
  border-radius: .4831rem .4831rem 0 0;
  @include sizeColor(.3382rem, $black4);
  .title{
    font-weight: bold;
  }
  .step{
    margin-top: .4348rem;
  }
}
.step-card{
  @include align;
  padding: .3865rem 0 .3865rem .3382rem;
  position: relative;
  border-radius: .2415rem;
  margin-top: .4831rem;
  &:first-child{
    background-color: #faf7f4;
  }
  &:last-child{
    background-color: #F7F9FB;
    .ks-icon{
      background-color: $blue;
    }
  }
  .ks-icon{
    @include widthHeight(1.2077rem,1.2077rem);
    @include sizeColor(.5797rem, $white);
    border: 0;
    flex-shrink: 0;
    text-align: center;
    line-height: 1.2077rem;
    background-color: $maincolor;
    border-radius: 50%;
  }
  .detail{
    @include justify(center);
    width: calc(100% - 1.9324rem);
    flex: 1;
    flex-direction: column;
    margin-left: .3382rem;
    .title{
      @include sizeColor(.4348rem, $black4);
      line-height: .5797rem;
      font-weight: bold;
      @include align;
    }
    .require{
      @include sizeColor(.3382rem, $black5);
    }
  }
}
</style>