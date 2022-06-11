<template>
  <section class="child_page">
    <head-top crossover="全部活动"></head-top>
    <section class="content">
      <van-tabs v-model="isFinished" swipeable @click="changeTabs">
        <van-tab title="全部" name=""></van-tab>
        <van-tab :title="'未完成'+ unfinishedDom" name="0"></van-tab>
        <van-tab title="未开始" name="-1"></van-tab>
        <van-tab title="已完成" name="1"></van-tab>
      </van-tabs>
    </section>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新完成">
      <div v-if="isFinished == '0'" class="unfinished-btn">
        <van-button round block type="primary" :class="{'submit-btn primary-info-btn':true,isBtnActive:!expired}"
          @click="()=>expired=0">进行中
        </van-button>
        <van-button round block type="primary" :class="{'submit-btn primary-info-btn':true,isBtnActive:expired}"
          @click="()=>expired=1">已过期
        </van-button>
      </div>
      <van-list v-model="listloading" :finished="list.listfinished" finished-text="没有更多了" @load="onListLoad"
        :immediate-check="false" offset="100">
        <div class="task-item" v-for="item,index in list.list" :key="index">
          <div class="task-title">
            <div class="task-title-text">
              {{item.taskName}}
            </div>
            <div class="task-finish"
              v-if="item.isFinished=='0' && new Date(item.leaveStartTime).getTime()<=new Date(item.startDate).getTime() && new Date(item.leaveEndTime).getTime()>=new Date(item.endDate).getTime()">
              <van-image src="static/image/askforleave.png"></van-image> 请假
            </div>
            <div class="task-finish" v-else-if="item.startStatus =='0'">
              <span class="laststart-time">
                <van-icon name="clock-o" />
                {{computedDate(item).lastTime}}
              </span>后开始
            </div>
            <div class="task-finish" v-else-if="computedDate(item).status =='1'">
              <span class="lastend-time">
                <van-icon name="clock-o" />
                {{computedDate(item).lastTime}}
              </span>后截止
            </div>
            <div class="task-finish" v-else>
              <i class="ks-icon ks-icon-expired"></i>已过期
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
              <van-button v-if="item.isFinished=='0' && item.startTime" round block type="primary"
                class="submit-btn primary-btn">继续运动
              </van-button>
              <van-button v-else-if="item.isFinished=='0' && item.startStatus=='0' " round block type="primary"
                class="submit-btn primary-btn unstart-btn" :disabled="true">开始运动
              </van-button>
              <van-button v-else-if="item.isFinished=='0'" round block type="primary" class="submit-btn primary-btn">
                开始运动
              </van-button>
              <van-button v-else-if="item.isFinished=='1' && item.validated == '0'" round block type="primary"
                class="submit-btn primary-plain-btn primary-btn validate-btn">待校对</van-button>
              <van-button v-else-if="item.isFinished=='1' && computedDate(item).status=='1'" round block type="primary"
                class="submit-btn primary-plain-btn primary-btn ">再次运动
              </van-button>
              <van-button v-else-if="item.isFinished=='1'" round block type="primary"
                class="submit-btn primary-plain-btn primary-btn">已完成
              </van-button>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <transition name="router-show">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import headTop from 'components/header/head.vue';
import mIcon from '@/components/motion-icon/icon.vue';
import { getStore, setStore } from "@/config/mUtil.js";
export default {
  data() {
    return {
      memberId: '',
      isFinished: '',//是否完成
      expired: 0, //是否过期
      unfinishedCount: 0,
      sportTaskList: {// 当前页面所有列表
        allList: {
          pageNum: '0',
          listfinished: false,
          list: []
        },
        unfinishedExpiredList: { // 未完成 已过期
          pageNum: '0',
          listfinished: false,
          list: []
        },
        unfinishedUnexpiredList: { // 未完成 进行中
          pageNum: '0',
          listfinished: false,
          list: []
        },
        unStartList: {
          pageNum: '0',
          listfinished: false,
          list: []
        },
        finishedList: {
          pageNum: '0',
          listfinished: false,
          list: []
        },
      },
      cacheSportTaskList: {},// 缓存列表
      listloading: false,
      listfinished: false,
      refreshing: false,
    }
  },
  components: { headTop, mIcon },
  computed: {
    unfinishedDom() {
      if (this.unfinishedCount) {
        return '(' + this.unfinishedCount + ')'
      } else {
        return ''
      }
    },
    list() {
      let result;
      switch (this.isFinished) {
        case '0':
          if (this.expired == 1) {
            result = this.sportTaskList.unfinishedExpiredList; // 未完成 已过期
          } else {
            result = this.sportTaskList.unfinishedUnexpiredList; // 未完成 进行中
          }
          break;
        case '1':
          result = this.sportTaskList.finishedList;
          break;
        case '-1':
          result = this.sportTaskList.unStartList;
          break;
        default:
          result = this.sportTaskList.allList;
          break;
      }
      return result
    }
  },
  created() {
    this.isFinished = this.$route.query.type || '';
    this.unfinishedCount = this.$route.query.unfinishedCount;
    this.memberId = JSON.parse(getStore('currentMember')).memberId;
    this.cacheSportTaskList = JSON.parse(getStore(this.memberId + 'getStuSportTaskList')) || {};
    this.getStuSportTaskList();
  },
  methods: {
    // 比较时间 0未开始(开始剩余时) 1已开始未结束(截止剩余时间) 2已结束已过期...
    computedDate(data) {
      const now = new Date().getTime();
      const startDate = new Date(data.startDate + ' 00:00:00').getTime();
      const endDate = new Date(data.endDate + ' 23:59:59').getTime();
      let status;
      let lastTime;
      if (startDate > now) {
        status = '0';
        lastTime = this.computedTime(startDate, now)
      } else if (startDate <= now && now <= endDate) {
        status = '1';
        lastTime = this.computedTime(endDate, now)
      } else {
        status = '2'
      }
      return {
        status, lastTime
      }
    },
    computedTime(date, now) {
      let lastTime = parseInt((date - now) / (1000 * 60 * 60));
      if (0 < lastTime && lastTime <= 24) {
        lastTime = lastTime + '小时'
      } else if (lastTime > 24) {
        lastTime = parseInt(lastTime / 24) + '天' + lastTime % 24 + '小时'
      } else {
        lastTime = '1小时'
      }
      return lastTime
    },
    toCompleteDetail(data) {
      this.$router.push("/complete/all/detail");
      setStore('taskDetail', data)
    },
    changeTabs() {
      this.listloading = true;
      if (this.list.pageNum == '0') {
        this.getStuSportTaskList();
      } else {
        this.listloading = false
      }
    },
    onListLoad() {
      this.getStuSportTaskList();
    },
    onRefresh() {
      // 清空列表数据
      this.list.listfinished = false;

      // 重新加载数据
      // 将 listloading 设置为 true，表示处于加载状态
      this.listloading = true;
      this.onListLoad();
    },
    getStuSportTaskList() {
      const { isFinished, expired, refreshing, cacheSportTaskList } = this;
      let key = '';
      switch (isFinished) {
        case '0':
          if (expired == 1) {
            key = 'unfinishedExpiredList';
          } else {
            key = 'unfinishedUnexpiredList';
          }
          break;
        case '1':
          key = 'finishedList';
          break;
        case '-1':
          key = 'unStartList';
          break;
        default:
          key = 'allList';
          break;
      }

      // 下拉刷新
      if (refreshing) {
        // 清空缓存页面列表
        cacheSportTaskList[key] = {
          list: []
        };
        // 当前页面对应列 pageNum=1
        this.sportTaskList[key].pageNum = '0';
        // 停止下拉刷新
        this.refreshing = false;
      }

      const pageNum = (parseInt(this.sportTaskList[key].pageNum) + 1).toString();

      // 若缓存中存在 则用缓存中数据 当前页面列表对应列更新 缓存列表不更新
      if (cacheSportTaskList[key] && cacheSportTaskList[key].list.length > 10 * (parseInt(pageNum) - 1)) {
        if (cacheSportTaskList[key].list.length < 10 * parseInt(pageNum)) {
          this.sportTaskList[key].listfinished = true
        }
        this.sportTaskList[key].list = cacheSportTaskList[key].list.slice(0, pageNum * 10);
        this.sportTaskList[key].pageNum = pageNum;
        setTimeout(() => {
          this.listloading = false;
        }, 1000)
        return
      }

      // 发请求说明缓存列表所需数据不存在
      this.$api.getStuSportTaskList({ isFinished, expired, pageNum: pageNum }).then(res => {
        const data = res.data;
        // 缓存页面列表对应列 赋值
        // 若无key 初始化
        if (!cacheSportTaskList[key]) {
          cacheSportTaskList[key] = {
            list: []
          };
        }
        cacheSportTaskList[key].pageNum = pageNum;
        cacheSportTaskList[key].list = cacheSportTaskList[key].list.concat(data);
        if (data.length < 10) {
          cacheSportTaskList[key].listfinished = true
        }
        // 当前页面列表对应列 赋值
        this.sportTaskList[key] = cacheSportTaskList[key];
        // localstorage赋值
        setStore(this.memberId + 'getStuSportTaskList', cacheSportTaskList);
        this.cacheSportTaskList = cacheSportTaskList;
        // 清除loading
        setTimeout(() => {
          this.listloading = false;
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
header /deep/{
  background-color: $maincolor;
  .goback, .covers_name span{
    color: $white1;
  }
}
.content{
  padding-top: 1.207729rem;
}
.van-tabs /deep/{
  padding: 0rem .483092rem .241546rem;
  background-color: $maincolor;
  border-radius: 0 0 .483092rem .483092rem;
  .van-tabs__nav{
    background-color: $maincolor;
  }
  .van-tab{
    color: $white3;
  }
  .van-tab--active{
    color: $white;
    font-size: .434783rem;
  }
  .van-tabs__line{
    background-color: $white;
  }
}
.van-pull-refresh{
  position: absolute;
  top: 2.657005rem;
  bottom: 0;
  width: 100%;
  overflow: auto;
  padding-top: .386473rem;
  .task-item:first-child{
    margin-top: 0;
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
  border-radius: .241546rem;
  .task-title{
    display: flex;
    @include sizeColor(.362319rem, $black4);
    font-weight: bold;
    .task-title-text{
      flex: 1;
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
      .validate-btn{
        border-color: $blue;
        .van-button__text{
          color: $blue;
        }
      }
    }
  }
  .task-finish {
    @include sizeColor(.289855rem, $black6);
    font-weight: 400;
    display: flex;
    align-items: center;
    .ks-icon{
      font-size: .289855rem;
    }
    .laststart-time{
      color: $blue;
      font-weight: 500;
    }
    .lastend-time{
      color: $red;
      font-weight: 500;
    }
    .van-image{
      @include widthHeight(.289855rem, .289855rem)
    }
  }
}
.unfinished-btn{
  margin: 0 0 .386473rem .386473rem;
  .submit-btn{
    width: auto;
    height: auto;
    display: inline-block;
    margin-right: .386473rem;
    border-color: $gray2;
    background-color: #FAFAFA;
    padding: 0;
    .van-button__text{
      font-size: .362319rem;
      padding: .144928rem .386473rem;
      font-weight: 500;
      color: $black6;
    }
  }
  .isBtnActive{
    border-color:#FF7F0060;
    background-color: #FFF8F2;
    .van-button__text{
      color: $maincolor;
      font-weight: 600;
    }
  }
  .van-button:active::before{
    opacity: 0;
  }
}

</style>