<template>
  <section class="child_page">
    <section class="content" v-if="list.combinationSportDetailList.length>1">
      <section class="content-detail">
        <div class="title">活动完成</div>
        <div class="statistic">
          <div class="card first-card">
            <div class="title">活动总项目</div>
            <div class="time"><span class="num">{{totalNum}}</span></div>
          </div>
          <div class="split14"></div>
          <div class="card second-card">
            <div class="title">活动总时长</div>
            <div class="time">
              <span v-if="parseInt(totalTime/60)"><span class="num">{{parseInt(totalTime/60)}}</span>分</span>
              <span v-if="totalTime%60"><span class="num">{{totalTime%60}}</span>秒</span>
            </div>
          </div>
        </div>
        <div class="task-list">
          <div class="task-item" v-for="sport,index in list.combinationSportDetailList" :key="sport.sportOrder"
            v-if="sport.sportType!=='-1'">
            <div class="task-icon">
              <m-icon :sportType="sport.sportType" :type='4'>
              </m-icon>
            </div>
            <div class="task-detail">
              <div class="task-title">
                <span v-if="sport.sportType =='-2'">
                  {{sport.userDefinedSportName}}
                </span>
                <span v-else>{{sportMap.get(sport.sportType)}}</span>
              </div>
              <div v-if="sport.sportType =='-2'">
                <div class="task-num">
                  <span class="task-name">目标：</span>
                  <span class="task-value">{{sport.targetNum}}
                    <span class="task-unit">个</span>
                  </span>
                  <span class="task-value">
                    <span>/</span>
                    {{sport.targetTime}}
                    <span class="task-unit">秒</span>
                  </span>
                  <span class="task-value">
                    <span>/</span>
                    {{sport.targetMeasure}}
                    <span class="task-unit">cm</span>
                  </span>
                </div>
                <div v-if="sport.trainingDate" class="task-num">
                  <span class="task-name">成绩：</span>
                  <span class="task-value">
                    <u>{{sport.countingNumber}}</u>
                    <span class="task-unit">个</span>
                  </span>
                  <span class="task-value">
                    <span>/</span>
                    <u>{{sport.exerciseTime}}</u>
                    <span class="task-unit">秒</span>
                  </span>
                  <span class="task-value">
                    <span>/</span>
                    <u>{{sport.measure}}</u>
                    <span class="task-unit">厘米</span>
                  </span>
                </div>
              </div>
              <div class="task-num" v-else>
                <span class="task-name">目标:</span>
                <span class="task-value">{{sport.target}}
                  <span class="task-unit">{{sport.countType=='1'?'秒':'个'}}</span>
                </span>
                <span class="task-name">成绩:</span>
                <span class="task-value">{{sport.countingNumber}}
                  <span class="task-unit">{{sport.countType=='1'?'个':'秒'}}</span>
                </span>
                <span v-if="['09','10'].indexOf(sport.sportType)>-1" class="measure">
                  <span class="task-name">测量成绩:</span>
                  <span class="task-value">{{sport.measure}}
                    <span class="task-unit">厘米</span>
                  </span>
                </span>
              </div>
              <div class="task-comment" v-if="sport.comments">活动情况:{{sport.comments}}</div>
            </div>
          </div>
        </div>
        </div>
      </section>
    </section>
    <section class="content" v-else>
      <section class="content-detail">
        <div class="title">活动完成</div>
        <div class="task-list">
          <div class="task-item" v-for="sport in list.combinationSportDetailList" :key="sport.sportOrder">
            <div class="task-icon">
              <m-icon :sportType="sport.sportType" :type='4'>
              </m-icon>
            </div>
            <div class="task-detail">
              <div class="task-title">
                <span>{{sportMap.get(sport.sportType)}}</span>
              </div>
              <div class="task-num">运动项目</div>
            </div>
          </div>
        </div>
        <div v-for="sport in list.combinationSportDetailList" class="one-sport">
          <div class="statistic" v-if="sport.sportType=='-2'">
            <div class="card first-card">
              <div class="title">运动时长</div>
              <div class="time"><span class="num">{{sport.exerciseTime}}</span>秒</div>
            </div>
            <div class="split14"></div>
            <div class="card second-card">
              <div class="title">运动个数</div>
              <div class="time"><span class="num">{{sport.countingNumber}}</span>个</div>
            </div>
            <div class="split14"></div>
            <div class="card third-card">
              <div class="title">测量成绩</div>
              <div class="time"><span class="num">{{sport.measure}}</span>厘米</div>
            </div>
          </div>
          <div class="statistic" v-else>
            <div class="card first-card">
              <div class="title">目标</div>
              <div class="time"><span class="num">{{sport.target}}</span>{{sport.countType=='1'?'秒':'个'}}</div>
            </div>
            <div class="split14"></div>
            <div class="card second-card">
              <div class="title">成绩</div>
              <div class="time"><span class="num">{{sport.countingNumber}}</span>{{sport.countType=='1'?'个':'秒'}}
              </div>
            </div>
            <div class="split14"></div>
            <div class="card third-card" v-if="['09','10'].indexOf(sport.sportType)>-1">
              <div class="title">测量成绩</div>
              <div class="time"><span class="num">{{sport.measure}}</span>厘米</div>
            </div>
          </div>
        </div>
        <section class="task-video">
          <video id="myVideo" ref="myVideo" class="video-js vjs-big-play-centered" :poster="video.videoPhotoUrl">
            <source :src="video.videoUrl" type="video/mp4">
          </video>
        </section>
      </section>
    </section>
    <section class="foot" v-if="list.isFinished =='0' ||  list.status!=='2' || list.validated=='0'">
      <van-button round block type="primary" class="submit-btn primary-btn" @click="finishSport">
        <span>完成</span>
      </van-button>
    </section>
  </section>
</template>

<script>
import Video from 'video.js';
import 'video.js/dist/video-js.min.css';

import mIcon from '@/components/motion-icon/icon.vue';
import { getStore, removeStore } from "@/config/mUtil.js";
import { sportList, videoOptions } from "@/config/constant.js";
import { fileUrl } from "@/config/env.js";

export default {
  data() {
    return {
      list: {
        createMemberName: '',
        endDate: '',
        isFinished: '1',
        combinationSportDetailList: [],
        startDate: '',
        endDate: '',
      },
      sportNoticeAndPropsResult: {}, // 运动道具准备 和 运动须知
      totalTime: 0, // 总用时
      videoList: [], // 运动视频
      video: { // 运动视频
        index: '',
        videoPhotoUrl: '',
        videoUrl: ''
      },
    }
  },
  computed: {
    totalNum() {
      return Math.ceil(this.list.combinationSportDetailList.length / 2)
    },
    sportMap() {
      const map = new Map();
      for (const sport of sportList) {
        map.set(sport.sportType, sport.sportName)
      }
      return map;
    },
  },
  watch: {
    'list.combinationSportDetailList'(val) {
      let totalTime = 0;
      let videoList = [];
      for (let sport of val) {
        if (sport.sportType !== '-1') {
          // 运动总用时
          totalTime += parseInt(sport.exerciseTime);
          sport.videoPhotoUrl = fileUrl + sport.videoPhotoUrl;
          sport.videoUrl = fileUrl + sport.videoUrl;
          videoList.push(sport)
        }
      }
      this.totalTime = totalTime;
      this.videoList = videoList;
      this.video = this.videoList[0]
      this.video.index = 0;
      if (val.length == 1) {
        this.initVideo();
      }
      return val
    },
  },
  components: { mIcon },
  created() {
    this.list = JSON.parse(getStore('taskDetail'));
    if (this.list.isFinished == '1') {
      this.getFinishedSportTaskDetail()
    }
  },
  beforeDestroy() {
    if (this.myPlayer) {
      this.myPlayer.dispose();
    }
  },
  methods: {
    initVideo() {
      //初始化视频方法
      this.$nextTick(() => {
        const myVideo = this.$refs.myVideo;
        this.myPlayer = Video(myVideo, videoOptions);
      })
    },
    getFinishedSportTaskDetail() {
      this.$api.getFinishedSportTaskDetail({ id: this.list.id }).then(res => {
        this.viewed = res.data.sportTaskDetail.viewed;
        this.commentList = res.data.commentList;
        this.$set(this.list, 'combinationSportDetailList', res.data.sportTaskDetail.combinationSportDetails);
        this.list.isWaitReplace = '0'
        this.list.validated = res.data.sportTaskDetail.validated;
      })
    },
    finishSport() {

    },
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
.child_page{
  overflow: auto;
  background: url("/static/image/finish_bg.png") center center / 100% 100%;
}
.content{
  padding-top: 1.256039rem;
  .content-detail{
    margin-top: -0.483092rem;
    padding: .483092rem .845411rem 0rem;
    margin-bottom: 2.173913rem;
    .title{
      @include sizeColor(.676329rem, $black4);
      font-weight: bold;
    }
    .statistic{
      display: flex;
      margin-top: .724638rem;
      .card{
        background-color: $bgcolor3;
        border-radius: .241546rem;
        padding: .338164rem .386473rem;
        flex:1;
        flex-shrink: 0;
        font-weight: 500;
        .title{
          @include sizeColor(.362319rem, $black1);
          margin-bottom: .362319rem;
          position: relative;
          padding-left: .241546rem;
          &::before{
            content: '';
            @include topcenter;
            left: 0;
            width: .072464rem;
            height: .362319rem;
            
            border-radius: .048309rem;
            margin-right: .120773rem;
          }
        }
        .num{
          @include sizeColor(.507246rem, $black1);
          font-weight: bold;
          margin-right: .096618rem;
        }
        .time{
          @include sizeColor(.289855rem, $black3);
        }
      }
      .first-card .title::before{
        background-color: $maincolor;
      }
      .second-card .title::before{
        background-color: $blue;
      }
      .third-card .title::before{
        background-color: $maincolor;
      }
    }
    .one-sport .statistic{
      margin-top: 0;
    }
  }
}

.task-list .task-item:not(:last-child){
  .task-icon::before{
    content: '';
    width: .096618rem;
    height: calc(100% - .917874rem);
    top: .917874rem;
    @include leftcenter;
    background: url("/static/image/dashedlight.png") 0 0/ 100% auto;
  }
  .task-icon-gray::before{
    background: url("/static/image/dashed.png") 0 0/ 100% auto;
  }
}
.task-list{
  margin-top: .724638rem;
  position: relative;
  .viewed{
    position: absolute;
    @include widthHeight(1.618357rem, 1.618357rem);
    right: 0;
    top: -0.241546rem;
  }
  .task-item{
    display: flex;
    .task-icon{
      width: .966184rem;
      position: relative;
    }
    .task-detail{
      flex:1;
      margin-left: .338164rem;
      display: flex;
      flex-direction: column;
      padding-bottom: .676329rem;
      .task-title{
        @include sizeColor(.362319rem, $black1);
        font-weight: bold;
        display: flex;
        margin-bottom: .120773rem;
      }
      .task-num{
        @include sizeColor(.289855rem, $black1);
        display: flex;
        align-items: baseline;
        .task-name{
          &:not(:first-child){
            margin-left: .241546rem;
          }
        }
        .task-value{
          font-size: .362319rem;
          font-weight: bold;
        }
        .task-unit{
          font-weight: 500;
        }
        .measure{
          padding-left: .241546rem;
        }
      }
      .task-comment{
        @include sizeColor(.362319rem, $black4);
      }
    }
  }
}

.task-video{
  @include widthHeight(100%,auto);
}
.video-js /deep/{
  @include widthHeight(100%,5.676329rem);
  border-radius: .483092rem;
  overflow: hidden;
  margin-top: .362319rem;
  .vjs-big-play-button{
    @include widthHeight(1.304348rem, 1.304348rem);
    border-radius: 50% !important;
    margin: 0 !important;
    transform: translate(-50%, -50%);
  }
}

.foot{
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 2.173913rem;
  padding: .362319rem .821256rem;
  display: flex;
  .submit-btn{
    margin-top: .483092rem;
    height: 1.062802rem !important;
    flex: 1;
  }
}
</style>