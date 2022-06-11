<template>
  <section class="page">
    <head-top customer="true" notice="true" id="header">
      <section class="name" id="name" slot="lefttool">{{currentMember.memberName}}</section>
    </head-top>
    <van-pull-refresh v-model="loading" @refresh="onRefresh" success-text="刷新完成" class="content" id="content">
      <section class="profile">
        <profile-icon :url="currentMember.memberPhotoUrl" />
        <div class="profile-detail">
          <div class="name">
            <span class="ellipsis">{{currentMember.memberName}}</span>
            <img v-if="currentMember.certifiedType =='0'" src="/static/image/student.png" alt="">
            <img v-if="currentMember.certifiedType =='1'" src="/static/image/teacher.png" alt="">
            <i class="ks-icon ks-icon-bianji"></i>
          </div>
          <div class="school ellipsis">
            {{formatSchool(currentMember)}}
          </div>
        </div>
        <div class="switch" @click="switchMember">
          <i class="ks-icon ks-icon-switch"></i>
          <span>切换成员</span>
        </div>
      </section>
      <section class="physique card">
        <div class="title">
          <img src="./image/physique.png" alt="">
          体质中心
        </div>
        <div class="card-num" ref="radarchart"></div>
      </section>
      <section class="data-detail">
        <section class="flex1">
          <section class="split14"></section>
          <section class="card">
            <div class="title">
              <img src="./image/task.png" alt="">
              活动
            </div>
            <div class="card-num">
              <div class="one">
                <span class="medium">212</span>
                <span class="unit">次</span>
              </div>
            </div>
          </section>
          <section class="split14"></section>
          <section class="card">
            <div class="title">
              <img src="./image/sport.png" alt="">
              运动
            </div>
            <div class="card-num">
              <div class="one">
                <span class="medium">200</span>
                <span class="unit">分钟</span>
              </div>
            </div>
          </section>
          <section class="split14"></section>
          <section class="card">
            <div class="title">
              <img src="./image/star.png" alt="">
              活力星
            </div>
            <div class="card-num">
              <div class="one">
                <span class="medium">20</span>
                <span class="unit">个</span>
              </div>
            </div>
          </section>
        </section>
        <section class="flex1">
          <section class="split14"></section>
          <section class="card">
            <div class="title">
              <img src="./image/race.png" alt="">
              竞技记录
            </div>
            <div class="card-num">
              <div class="two">
                <span class="big">180</span>
              </div>
              <div class="two">
                <span class="unit">获胜场次</span>
              </div>
            </div>
          </section>
          <section class="split14"></section>
          <section class="card">
            <div class="title">
              <img src="./image/medal.png" alt="">
              勋章
            </div>
            <div class="card-num">
              <div class="two">
                <span class="big">180</span>
                <span class="medium">/70</span>
              </div>
              <div class="two">
                <span class="unit">已获勋章/全部勋章</span>
              </div>
            </div>
          </section>
        </section>
      </section>
      <section class="card list">
        <van-cell title="排行榜" is-link to="">
          <template #icon>
            <img src="./image/rank.png" />
          </template>
        </van-cell>
        <van-cell title="最高纪录" is-link to="">
          <template #icon>
            <img src="./image/record.png" />
          </template>
        </van-cell>
        <van-cell title="成员管理" is-link to="/my/member">
          <template #icon>
            <img src="./image/member.png" />
          </template>
        </van-cell>
        <van-cell title="帮助中心" is-link to="">
          <template #icon>
            <img src="./image/help.png" />
          </template>
        </van-cell>
        <van-cell title="设置" is-link to="">
          <template #icon>
            <img src="./image/install.png" />
          </template>
        </van-cell>
      </section>
    </van-pull-refresh>
    <foot></foot>
    <van-action-sheet v-model="modelShow" :title="'切换成员('+members.length+')'" class="model-actionsheet"
      :close-on-popstate="true">
      <div class="member-list actionsheet-body">
        <div v-for="item in members" :key="item.memberId" class="profile member-item" @click="switchMemberClick(item)">
          <profile-icon :url="item.memberPhotoUrl" />
          <div class="profile-detail">
            <div class="name">
              <span class="ellipsis">{{item.memberName}}</span>
              <img v-if="item.certifiedType =='0'" src="/static/image/student.png" alt="">
              <img v-if="item.certifiedType =='1'" src="/static/image/teacher.png" alt="">
            </div>
            <div class="school ellipsis">
              {{formatSchool(item)}}</div>
          </div>
          <div v-if="item.memberId == currentMember.memberId">
            <van-icon name="checked" color="#ff7f00" size=".57971rem" />
          </div>
        </div>
      </div>
      <div class="actionsheet-button">
        <van-button round block type="primary" icon="add-o" class="submit-btn primary-info-btn primary-btn"
          @click="addMember">添加成员
        </van-button>
        <van-button round block type="primary" class="submit-btn primary-btn" @click="managerMember">管理</van-button>
      </div>
    </van-action-sheet>
    <transition name="router-show">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import headTop from '@/components/header/head.vue';
import foot from '@/components/footer/foot.vue';
import profileIcon from '@/components/profile-icon/icon.vue';
import { getStore, setStore } from "@/config/mUtil.js";
import { fileUrl } from "@/config/env.js";

import { mapGetters } from "vuex";
// import * as echarts from 'echarts/core';
// import { TitleComponent, LegendComponent } from 'echarts/components';
// import { RadarChart } from 'echarts/charts';
// import { CanvasRenderer } from 'echarts/renderers';

// echarts.use([TitleComponent, LegendComponent, RadarChart, CanvasRenderer]);

import * as echarts from 'echarts';
export default {
  data() {
    return {
      loading: false,
      fileUrl: fileUrl,
      modelShow: false,
    }
  },
  computed: {
    ...mapGetters({
      currentMember: "member/getCurrentMember",
      members: "member/getMembers"
    })
  },
  components: { headTop, foot, profileIcon },
  mounted() {
    window.addEventListener('scroll', this.showTopbar);
    this.renderRadar();
  },
  destroyed() {
    window.removeEventListener('scroll', this.showTopbar)
  },
  methods: {
    showTopbar() {
      if (document.getElementById('content')) {
        let scrolltop = window.pageYOffset || document.getElementById('content').scrollTop || document.body.scrollTop;
        let header = document.getElementById('header');
        let name = document.getElementById('name');
        header.style.backgroundColor = 'rgba(255,255,255, ' + scrolltop / 60 + ')'
        name.style.color = 'rgba(0,0,0, ' + scrolltop / 80 + ')'
      }
    },
    formatSchool(data) {
      if (!data.schoolName && !data.className) {
        return ""
      } else if (!data.schoolName) {
        return data.className || ""
      } else if (!data.className) {
        return data.schoolName
      } else {
        return data.schoolName + "/" + data.className
      }
    },
    switchMember() {
      this.modelShow = true;
    },
    addMember() {
      this.modelShow = false;
      this.$router.push({
        path: "/my/member/edit",
        query: {
          type: "0" // 添加成员
        }
      })
    },
    managerMember() {
      this.modelShow = false;
      this.$router.push('/my/member')
    },
    switchMemberClick(data) {
      this.$store.dispatch("member/changeCurrentMember", data)
      this.modelShow = false;
    },
    renderRadar() {
      var myChart = echarts.init(this.$refs.radarchart);
      var option = {
        color: ['rgba(255, 127, 0, .9)'],
        radar: [
          {
            indicator: [
              { text: '速度', max: 150 },
              { text: '灵敏', max: 150 },
              { text: '柔韧', max: 150 },
              { text: '力量', max: 150 },
              { text: '耐力', max: 150 }
            ],
            center: ['50%', '55%'],
            startAngle: 90,
            splitNumber: 5,
            shape: 'circle',
            axisName: {
              formatter: '{value}',
              color: 'rgba(0, 0, 0, .65)',
              fontSize: 15
            },
            splitArea: {
              areaStyle: {
                color: ['#e0e0e0', '#e9e9e9', '#f1f1f1', '#f9f9f9', '#fefefe'],
                shadowBlur: 0
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(204, 204, 204, .65)',
                type: [2, 2]
              }
            },
            splitLine: {
              lineStyle: {
                color: '#eee',
              }
            }
          }
        ],
        series: [
          {
            type: 'radar',
            data: [
              {
                value: [150, 150, 150, 150, 150],
                name: 'Data A',
                lineStyle: {
                  color: "transparent"
                },
                symbol: 'circle',
                symbolSize: 7,
                itemStyle: {
                  color: '#fefefe',
                  borderWidth: 1,
                  borderColor: '#FF7F00'

                }
              },
              {
                value: [140, 150, 130, 110, 150],
                name: 'Data B',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: "rgba(255, 127, 0, 0.85)", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "rgba(255, 197, 61, 0.32)", // 100% 处的颜色
                      },
                    ],
                    false
                  ),
                },
                symbol: 'none'
              }
            ]
          }
        ]
      }
      myChart.setOption(option);
    },
    onRefresh() {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
.page{
  background: -webkit-gradient(linear ,0% 0%,0% 100%,
                color-stop(0,rgba(255,255,255,1)),
                color-stop(0.1,rgba(255,255,255,0)),
                color-stop(0.2,$bgcolor2),
                color-stop(1,$bgcolor2)
             );
}
.page header{
  line-height: 1.062802rem;
  background: transparent;
  .name{
    position: absolute;
    left: .386473rem;
    @include sizeColor(.434783rem, #fff);
    font-weight: bold;
  }
}
.content{
  padding: .386473rem .386473rem 2.294686rem;
}
.profile{
  padding-top: 1.449275rem;
  box-sizing: border-box;
  background: url("./image/top-bg.png") right center/auto 100%;
  @include align;
  >.van-image{
    @include widthHeight(1.594203rem, 1.594203rem);
    border: .024155rem solid #F2F2F2;
    flex-shrink: 0;
  }
  .profile-detail{
    @include justify(center);
    width: calc(100% - 3.719807rem);
    flex: 1;
    flex-direction: column;
    margin-left: .31401rem;
    .name{
      @include sizeColor(.57971rem, $black1);
      line-height: .57971rem;
      font-weight: bold;
      display: flex;
      span{
        max-width: calc(100% - 2.415459rem);
        display: inline-block;
      }
      img{
        @include widthHeight(1.376812rem, .507246rem);
        margin-left: .193237rem;
      }
      .ks-icon{
        @include sizeColor(.338164rem, $black6);
        margin-left: .193237rem;
      }
    }
    .school{
      @include sizeColor(.362319rem, $black2);
      margin-top: .241546rem;
    }
  }

  .switch{
    @include sizeColor(.31401rem, $black1);
    @include widthHeight(2.125604rem, .676329rem);
    line-height: .676329rem;
    text-align: center;
    border-radius: .326087rem 0 0 .326087rem;
    background: linear-gradient(to right,#F6D89D, #F8CB75 );
    margin-right: -0.386473rem;
  }
}
.card{
  flex:1;
  padding: .338164rem .241546rem;
  box-sizing: border-box;
  border-radius: .241546rem;
  background-color: $bgcolor;
  min-height: 2.705314rem;
  .title{
    @include sizeColor(.434783rem, $black1);
    line-height: .748792rem;
    vertical-align: middle;
    font-weight: 500;
    margin-left: -0.120773rem;
    img{
      @include widthHeight(.748792rem, .748792rem);
      vertical-align: bottom;
    }
  }
  .card-num{
    height: calc(100% - .772947rem);
    width: 100%;
    .one{
      padding-top: .628019rem;
      .medium{
        @include sizeColor(.676329rem, $black1);
        font-weight: bold;
      }
      .unit{
        @include sizeColor(.362319rem, $black1);
      }
    }
    .two{
      padding-top: .628019rem;
      .big{
        @include sizeColor(.966184rem, $maincolor);
        font-weight: bold;
      }
      .medium{
        @include sizeColor(.676329rem, $black3);
        font-weight: bold;
      }
      .unit{
        @include sizeColor(.362319rem, $black2);
      }
    }
  }
}
.physique{
  height: 6.086957rem;
  padding: .434783rem .338164rem;
  background: url("./image/physique-bg.png") center center / 100% 100%;
  margin-top: .338164rem;
  .title{
    position: absolute;
  }
  .card-num{
    height: calc(100% - .362319rem);
  }
}
.data-detail{
  display: flex;
  .flex1{
    flex:1;
    display: flex;
    flex-direction: column;
    height: 9.10628rem;
    &:first-child{
      margin-right: .169082rem;
    }
    &:last-child{
      margin-left: .169082rem;
    }
  }
}

.list{
  padding: 0rem .338164rem;
  margin-top: .338164rem;
  .van-cell{
    padding: .483092rem 0;
    .van-cell__title{
      @include sizeColor(.434783rem, $black1);
      font-weight: 500;
    }
    
    img{
      @include widthHeight(.57971rem,.57971rem);
      margin-right: .241546rem;
    }
    &::after{
      border: 0;
    }
    .van-cell__right-icon{
      @include sizeColor(.289855rem, #B1B2B3)
    }
  }
  .van-cell--clickable:active{
    border-radius: .241546rem;
    background: transparent;
  }
}
.model-actionsheet{
  .profile{
    padding-top: .57971rem;
    background: $bgcolor;
    &:first-child{
      padding-top: 0;
    }
    >.van-image{
      @include widthHeight(1.15942rem, 1.15942rem);
      border: 0;
    }
    .profile-detail{
      margin-left: .338164rem;
      .name{
        @include sizeColor(.386473rem, #34322E);
        margin-bottom: 0px;
      }
      .school{
        @include sizeColor(.338164rem, $black6);
      }
    }
  }
  .submit-btn{
    width: calc(50% - .2657rem);
    display: inline-block;
    &:first-child{
      margin-right: .434783rem;
    }
  }
}
</style>