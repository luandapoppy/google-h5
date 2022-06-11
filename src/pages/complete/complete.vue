<template>
  <section class="page">
    <head-top guide="true" customer="true">
      <section slot="lefttool" class="profile">
        <profile-icon :url="currentMember.memberPhotoUrl"></profile-icon>
        <div class="profile-detail">
          <div class="name">
            {{currentMember.memberName}}
          </div>
          <div class="school">
            <i v-if="currentMember.certifiedType=='0'" class="ks-icon ks-icon-student"></i>
            {{currentMember.className}}
          </div>
        </div>
      </section>
      <section slot="righttool">
        <van-button plain round type="primary">请假</van-button>
      </section>
    </head-top>
    <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh" success-text="刷新完成" class="content">
      <!-- 日历组件 -->
      <calendar ref="calendar" class="calendar" v-if="refresh" @chooseDay="getTaskList" />
      <div class="list-wrapper">
        <div class="title">
          <m-icon sportType="15" :type="4"></m-icon>
          <span>{{istoday?'今日': checkDate+'的'}}活动</span>
          <div class="task-status">
            <span>{{sportTaskList[date]?sportTaskList[date].statusData.finishedNum||0:0}}</span>
            <span>/</span>
            <span>{{taskStatusTotal}}</span>
          </div>
        </div>
        <!-- 当日活动列表 -->
        <section class="van-list" v-if="sportTaskList[date] && sportTaskList[date].sportTaskList.length>0" ref="list">
          <div class="task-item" v-for="item in sportTaskList[date].sportTaskList" :key="item.id">
            <div class="task-title">
              <div class="task-title-text">
                {{item.taskName}}
              </div>
              <div class="task-finish" v-if="item.isFinished == '1'">
                <i class="ks-icon ks-icon-star"></i>
                <span>+2</span>
              </div>
            </div>
            <div class="task-detail">
              <div class="task-sport-icon">
                <!-- 最多展示六项运动 省略图片 -->
                <span v-for="sport,idx in item.combinationSportDetailList" :key="idx"
                  v-if="sport.sportType !== '-1' && idx<11">
                  <van-image v-if="item.combinationSportDetailList.length>10 && idx==10 && item.isFinished=='0'"
                    src="static/image/ellipsis_gray.png">
                  </van-image>
                  <van-image v-else-if="item.combinationSportDetailList.length>10 && idx==10 && item.isFinished=='1'"
                    src="static/image/ellipsis_light.png">
                  </van-image>
                  <m-icon v-else :sportType="sport.sportType" :type="sport.trainingDate?2:3"></m-icon>
                </span>
              </div>
              <div class="task-btn" @click="toCompleteDetail(item)">
                <van-button v-if="item.isFinished=='1' && (item.validated == '1' || item.validated == '-1')" round block
                  type="primary" class="submit-btn primary-plain-btn primary-btn">已完成
                </van-button>
                <van-button v-else-if="item.isFinished=='1' && item.validated == '0'" round block type="primary"
                  class="submit-btn primary-plain-btn primary-btn validate-btn">待校对</van-button>
                <van-button v-else-if="item.isFinished=='0'" round block type="primary" class="submit-btn primary-btn">
                  去完成
                </van-button>
              </div>
            </div>
          </div>
        </section>
        <!-- 空页面 -->
        <empty v-else />
        <!-- 活动统计 -->
        <section class="statistic">
          <div class="statistic-card" @click="toAll()">
            <i class="statistic-icon ks-icon ks-icon-total"></i>
            <div class="statistic-detail">
              <div class="statistic-title">
                <span>全部活动</span>
                <van-icon name="arrow" />
              </div>
              <div class="statistic-num">
                {{statisticData.total}}个
              </div>
            </div>
          </div>
          <div class="split14"></div>
          <div class="statistic-card" @click="toAll('0')">
            <i class="statistic-icon ks-icon ks-icon-total"></i>
            <div class="statistic-detail">
              <div class="statistic-title">
                <span>未完成活动</span>
                <van-icon name="arrow" />
              </div>
              <div class="statistic-num">
                {{statisticData.unfinishedCount}}个
              </div>
            </div>
          </div>
        </section>
      </div>
    </van-pull-refresh>
    <foot></foot>
    <transition name="router-show">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import headTop from '@/components/header/head.vue';
import foot from '@/components/footer/foot.vue';
import mIcon from '@/components/motion-icon/icon.vue';
import profileIcon from '@/components/profile-icon/icon.vue';
import empty from '@/components/empty/empty.vue';
import Calendar from '@/components/calendar/calendar.vue';
import { fileUrl } from '@/config/env.js';
import { getStore, setStore, removeStore } from "@/config/mUtil.js";
export default {
  data() {
    return {
      currentMember: {
        className: "",
        memberPhotoUrl: "",
        memberId: ''
      },
      fileUrl: fileUrl,
      refreshLoading: false,// refreshloading
      checkDate: '', // 选中日期MM/dd
      date: "",// 选中日期 yyyy-MM-dd
      istoday: true, // 是否为今日
      sportTaskList: {
        // date:{statusData:{}, sportTaskList:[]}
      },
      list: {
        loading: false,
        finished: true
      },
      sportTaskStatisticData: {},
      refresh: true,
    }
  },
  computed: {
    taskStatusTotal() {
      if (this.sportTaskList[this.date]) {
        let statusData = this.sportTaskList[this.date].statusData;
        if (Object.keys(statusData).length > 0) {
          return statusData.finishedNum + statusData.unFinishedNum + statusData.unStartNum
        } else {
          return 0
        }
      } else {
        return 0
      }
    },
    statisticData() {
      let data = this.sportTaskStatisticData;
      if (data.finishedCount || data.finishedCount === 0) {
        data.total = data.finishedCount + data.notStartCount + data.unfinishedCount
      } else {
        data.total = 0;
        data.unfinishedCount = 0;
      }
      return data
    }
  },
  components: { headTop, foot, mIcon, profileIcon, Calendar, empty },
  created() {
    this.currentMember = JSON.parse(getStore('currentMember'));
    this.sportTaskList = JSON.parse(getStore(this.currentMember.memberId + 'getSportTaskList')) || {};
    this.getSportTaskStatisticData();
  },
  methods: {
    onRefresh() {
      // 清除数据 及缓存
      this.sportTaskList = {};
      setStore(this.currentMember.memberId + 'getSportTaskList', {});
      setStore(this.currentMember.memberId + 'getSportTaskStatisticData', {});
      setStore(this.currentMember.memberId + 'getSportTaskCalendarData', {});
      this.getSportTaskStatisticData();
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
        this.refreshLoading = false;
      })
    },
    getTaskList(date, istoday) {
      this.currentMember = JSON.parse(getStore('currentMember')) || {};
      this.istoday = istoday;
      const arr = date.split("-");
      this.date = date;
      this.checkDate = arr[1] + '/' + arr[2];
      // 有缓存返回
      if (this.sportTaskList[date]) {
        return
      }
      this.$api.getSportTaskList({ date: date, pageNum: "1" }).then(res => {
        let data = res.data;
        if (!data.statusData) {
          data.statusData = {}
        }
        this.$set(this.sportTaskList, date, data);
        setStore(this.currentMember.memberId + 'getSportTaskList', this.sportTaskList);
      })
    },
    getSportTaskStatisticData() {
      this.sportTaskStatisticData = JSON.parse(getStore(this.currentMember.memberId + 'getSportTaskStatisticData')) || {};
      if (this.sportTaskStatisticData.finishedCount) {
        return
      }
      this.$api.getSportTaskStatisticData({}).then(res => {
        this.sportTaskStatisticData = res.data;
        setStore(this.currentMember.memberId + 'getSportTaskStatisticData', res.data)
      })
    },
    toAll(type) {
      let query = {
        unfinishedCount: this.sportTaskStatisticData.unfinishedCount
      };
      if (type) {
        query.type = type
      }
      this.$router.push({
        path: "/complete/all",
        query: query
      })
    },
    toCompleteDetail(data) {
      this.$router.push("/complete/detail");
      setStore('taskDetail', data)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
.page{
  height: 100%;
}
header{
  background-color: $maincolor;
  height: 1.570048rem;
  color: $white;
  .right-tool{
    .van-button{
      background-color: transparent;
      border-color: $white;
      padding: .120773rem .241546rem;
      margin-right: .483092rem;
      height: auto;
      .van-button__text{
        @include sizeColor(.362319rem, $white)
      }
    }
  }
  .profile{
    @include topcenter;
    left: .386473rem;
    display: flex;
    align-items: center;
    >.van-image{
      @include widthHeight(.772947rem, .772947rem);
      border: .024155rem solid $white;
      flex-shrink: 0;
    }
    .profile-detail{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: .217391rem;
      .name{
        @include sizeColor(.434783rem, $white);
        line-height: .57971rem;
        font-weight: bold;
      }
      .school{
        @include sizeColor(.289855rem, $white2)
      }
    }
  }
}
.content{
  padding-top: 1.570048rem;
  height: 100%;
  background: $maincolor;
  overflow: auto !important;
  .calendar{
    height: 3.140097rem;
    background-color: #f8f8f8;
    border-radius: .483092rem .483092rem 0 0;
  }
}
.list-wrapper{
  height: calc(100% - 1.932367rem);
  margin-top: -0.724638rem;
  border-radius: .483092rem .483092rem 0 0;
  background-color: $bgcolor;
  padding-top: .57971rem;
  .title{
    @include align;
    font-weight: bold;
    padding-left: .386473rem;
    .van-image{
      @include widthHeight(.483092rem, .483092rem);
      margin-right: .120773rem;
    }
    span{
      @include sizeColor(.434783rem, $black4)
    }
    .task-status{
      font-weight: 500;
      padding: .072464rem .241546rem;
      background: $bgcolor3;
      border-radius: .31401rem;
      margin-left: .362319rem;
      display: flex;
      span{
        color: $black6;
        &:first-child{
          color: $maincolor;
          font-weight: bold;
        }
        &:nth-child(2){
          margin: 0 .048309rem;
        }
      }
    }
  }
  .van-list{
    background-color: $bgcolor;
    overflow: auto;
    padding-bottom: 3.864734rem;
  }
  .statistic{
    position: fixed;
    bottom: 1.690821rem;
    width: 100%;
    padding: .241546rem .386473rem .483092rem;
    background-color: rgba(255, 255, 255, 0.5);
    display: flex;
    .statistic-card{
      flex:1;
      display: flex;
      padding: .386473rem .338164rem;
      background-color: $bgcolor;
      box-shadow: 0 0 .966184rem rgba(33, 30, 30, 0.05);
      border-radius: .241546rem;
      align-items: center;
      .statistic-icon{
        @include widthHeight(.89372rem, .89372rem);
        @include sizeColor(.434783rem, $white);
        position: relative;
        border-radius: .241546rem;
        background-color: $maincolor;
        margin-right: .241546rem;
        &::before{
          @include center;
        }
      }
      .statistic-detail{
        flex: 1;
        .statistic-title{
          @include sizeColor(.434783rem, $black4);
          font-weight: bold;
          display: flex;
          align-items: center;
          >span{
            flex: 1
          }
          .van-icon{
            font-size: .434783rem;
          }
        }
        .statistic-num{
          @include sizeColor(.362319rem, $black5);
          font-weight: 500;
        }
      }
    }
  }
}

.task-item{
  padding: .362319rem;
  position: relative;
  margin-top: .338164rem;
  display: flex;
  flex-direction: column;
  background-color: $bgcolor;
  box-shadow: 0 0 .966184rem rgba(33, 30, 30, 0.05);
  margin: .338164rem .386473rem 0;
  border-radius: 0 .241546rem .241546rem 0;
  &::before{
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: .048309rem;
    border-radius: .241546rem;
  }
  &:nth-child(4n+1)::before{
    background-color: $maincolor;
  }
  &:nth-child(4n+2)::before{
    background-color: $green;
  }
  &:nth-child(4n+3)::before{
    background-color: $blue;
  }
  &:nth-child(4n+4)::before{
    background-color: $red;
  }
  .task-title{
    display: flex;
    @include sizeColor(.362319rem, $black4);
    font-weight: bold;
    .task-title-text{
      flex: 1;
    }
    .task-finish{
      color: $maincolor;
    }
  }
  .task-detail{
    display: flex;
    margin-top: .434783rem;
    .task-sport-icon{
      flex:1;
      .van-image{
        @include widthHeight(.676329rem,.676329rem);
        margin-right: .241546rem;
      }
    }
    .task-btn{
      flex-shrink: 0;
      .van-button--normal{
        padding: 0;
      }
      .van-button__text{
        font-size: .362319rem;
        padding: .144928rem .483092rem;
      }
    }
    .validate-btn{
      border-color: $blue;
      .van-button__text{
        color: $blue;
      }
    }
  }
}
</style>