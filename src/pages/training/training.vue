<template>
  <section class="page">
    <head-top guide="true" customer="true">
      <section slot="lefttool" class="tabs">
        <van-tabs v-model="active" @change="onClick" swipeable>
          <van-tab title="基础运动" name="single"></van-tab>
          <van-tab title="体验运动" name="experience"></van-tab>
        </van-tabs>
      </section>
    </head-top>
    <section class="content">
      <div v-for="item in list" :key="item.sportType" class="card" @click="sportClick(item)">
        <img :src="'/static/image/sport/sport-'+item.sportType+'.png'"></img>
        <div class="name">
          <span>{{item.sportname}}</span>
          <span class="detail">详情</span>
        </div>
      </div>
    </section>
    <introduce-action-sheet :modelShow="modelShow" :modelData="modelData" @closeModel="closeModel">
    </introduce-action-sheet>
    <foot></foot>
  </section>
</template>

<script>
import foot from '@/components/footer/foot.vue';
import headTop from '@/components/header/head.vue';
import { fileUrl } from '@/config/env.js';
export default {
  data() {
    return {
      active: 'single',
      list1: [
        {
          sportname: "跳绳",
          sportType: "01"
        }, {
          sportname: "立位体前屈",
          sportType: "08"
        }, {
          istest: true,
          sportname: "仰卧起坐",
          sportType: "03"
        }, {
          sportname: "坐位体前屈训练",
          sportType: "09"
        }, {
          sportname: "引体向上",
          sportType: "02"
        }, {
          sportname: "开合跳",
          sportType: "04"
        }, {
          sportname: "深蹲",
          sportType: "05"
        }, {
          sportname: "平板支撑",
          sportType: "06"
        },
      ],
      list2: [
        {
          sportname: "跳绳111",
          sportType: "01"
        }, {
          sportname: "立位体前屈",
          sportType: "08"
        }, {
          istest: true,
          sportname: "仰卧起坐",
          sportType: "03"
        }, {
          sportname: "坐位体前屈训练",
          sportType: "09"
        }, {
          sportname: "引体向上",
          sportType: "02"
        }, {
          sportname: "开合跳",
          sportType: "04"
        }, {
          sportname: "深蹲",
          sportType: "05"
        }, {
          sportname: "平板支撑",
          sportType: "06"
        },
      ],
      list: [],
      modelShow: false,
      fileUrl: fileUrl,
      modelData: {}
    }
  },
  components: { headTop, foot, introduceActionSheet: () => import('@/components/introduce-actionsheet/actionsheet.vue') },
  mounted() {
    this.list = this.list1;
  },
  methods: {
    onClick(name, title) {
      if (name == 'single') {
        this.list = this.list1;
      } else {
        this.list = this.list2;
      }
    },
    sportClick(e) {
      this.modelData = e;
      this.modelShow = true
    },
    closeModel() {
      this.modelShow = false
    },
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
.tabs{
  padding-left: .386473rem;
}
.content{
  padding: 1.256039rem .386473rem 2.173913rem;
  overflow: hidden;
  .card{
    width: 4.42029rem;
    float: left;
    margin-top: .724638rem;
    &:nth-child(even){
      margin-left: .386473rem;
    }
    img{
      width: 100%;
      height: 3.623188rem;
      border-radius: .241546rem;
    }
    .name{
      margin-top: .31401rem;
      @include sizeColor(.434783rem, $black1);
      font-weight: 500;
      .detail{
        float: right;
        @include sizeColor(.289855rem, $black3);
        padding: .120773rem .193237rem;
        border-radius: .2657rem;
        background-color: rgba($color: #000000, $alpha: 0.05);
      }
    }
  }
}
.model-actionsheet{
  .van-action-sheet__content{
    overflow: hidden;
  }
  .actionsheet-body{
    height: calc(100% - 1.690821rem);
    max-height: fit-content;
  }
  .video{
    @include widthHeight(100%, 5.676329rem);
    border-radius: .241546rem;
    object-fit: cover;
  }
  .node-title{
    @include sizeColor(.434783rem,$black4);
    padding: .483092rem 0;
    font-weight: bold;
  }

  ul{
    padding-left: .483092rem;
    li{
      padding-top: .338164rem;
      @include sizeColor(.362319rem,$black5);
      list-style: disc;
      &:first-child{
        padding-top: 0;
      }
    }
  }
  .submit-btn{
    height: auto;
    border: 0;
  }
  .submit-btn .van-button__text{
    font-size: .434783rem;
    font-weight: bold;
    padding: .321981rem 0 .330193rem;
  }
}
</style>