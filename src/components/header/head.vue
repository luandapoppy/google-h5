<template>
  <header>
    <slot name="lefttool"></slot>
    <section v-if="crossover || crossover==''" class="goback" @click="goBackThing">
      <i class="ks-icon ks-icon-left"></i>
    </section>
    <slot name='searchpart'></slot>
    <section class="covers_name" @click="refreshPage">
      <span class="ellipsis">
        {{crossover}}
      </span>
    </section>
    <section class="right-tool">
      <slot name="righttool"></slot>
      <i v-if="guide" class="ks-icon ks-icon-guide"></i>
      <i v-if="customer" class="ks-icon ks-icon-kefu"></i>
      <van-badge :content="5" v-if="notice">
        <i class="ks-icon ks-icon-notice"></i>
      </van-badge>
    </section>
  </header>
</template>

<script>

export default {
  data() {
    return {}
  },
  props: ['crossover', "backroute", "lefttool", "guide", "customer", "notice"],
  methods: {
    goBackThing() {
      this.backroute ? this.$router.push(this.backroute) : window.history.go(-1);
    },
    refreshPage() {//点击头部刷新页面
      this.$emit('refreshPage');
    }
  }
}
</script>
<style lang="scss" scoped>
	@import "static/css/public.scss";
	header{
		@include widthHeight(100%,1.256039rem);
		background:$white;
		z-index:200;
		color:$black;
		position: fixed;
    .goback{
      @include center;
      left: .386473rem;
      .ks-icon{
        @include sizeColor(.434783rem,$black);
        font-weight: bold;
      }
    }
    .covers_name{
      @include center;
      span{
        @include sizeColor(.434783rem,$black);
        font-weight: bold;
      }
    }
    .right-tool{
      display: flex;
      @include topcenter();
      right: .386473rem;
      line-height: 1;
      >.ks-icon{
        margin-right: .483092rem;
        &:last-child{
          margin-right: 0;
        }
      }
      .ks-icon{
        font-size: .57971rem;
      }
    }
	}
</style>