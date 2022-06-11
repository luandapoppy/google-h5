<template>
  <section class="child_page">
    <head-top ref="head" crossover="活动详情" guide="true" customer="true"></head-top>
    <section class="content">
      <section class="overview">
        <div class="card">
          <div class="title">{{list.createMemberName}}</div>
          <div class="explain">布置老师</div>
        </div>
        <div class="card">
          <div class="title">{{endDate}}</div>
          <div class="explain">截止时间</div>
        </div>
        <div class="card">
          <div class="title">
            <span>{{finishedNum}}</span>
            <span class="total">{{'/ '+totalNum}}</span>
          </div>
          <div class="explain">完成情况</div>
        </div>
      </section>
      <section
        :class="{'content-detail':true, 'no-btn': (list.isFinished =='1' && list.status=='2' && list.validated!=='0')}">
        <div class="title">活动要求</div>
        <div v-if="list.isFinished=='0'" class="statistic prepare">
          <div class="card small-card">
            <div class="title">预计用时</div>
            <div class="time"><span class="num">{{predictTime}}</span>秒</div>
          </div>
          <div class="card big-card">
            <div class="title">运动准备</div>
            <div class="detail" v-if="equipLIst.length>0">{{equipLIst.join("、")}}</div>
          </div>
        </div>
        <div v-else class="statistic finished">
          <div class="card big-card">
            <div class="title">完成时间</div>
            <div class="time"><span class="num">{{finishedTime}}</span></div>
          </div>
          <div class="card small-card">
            <div class="title">用时</div>
            <div class="time">
              <span v-if="parseInt(totalTime/60)"><span class="num">{{parseInt(totalTime/60)}}</span>分</span>
              <span v-if="totalTime%60"><span class="num">{{totalTime%60}}</span>秒</span>
            </div>
          </div>
        </div>
        <div class="task-list">
          <img class="viewed" v-if="list.viewed" src="/static/image/viewed.png"></img>
          <div class="task-item" v-for="sport,index in list.combinationSportDetailList" :key="sport.sportOrder"
            v-if="sport.sportType!=='-1'">
            <div class="task-icon" v-if="sport.trainingDate">
              <m-icon :sportType="sport.sportType" :type='4'>
              </m-icon>
            </div>
            <div class="task-icon task-icon-gray" v-else>
              <m-icon :sportType="sport.sportType" :type='5'>
              </m-icon>
            </div>
            <div class="task-detail">
              <div class="task-title">
                <span v-if="sport.sportType =='-2'">
                  {{sport.userDefinedSportName}}
                </span>
                <span v-else>{{sportMap.get(sport.sportType)}}</span>
                <span v-if="!sport.trainingDate" class="task-teach" @click="sportTeachClick(sport)">教程</span>
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
                    <span class="task-unit">s</span>
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
                    <span class="task-unit">s</span>
                  </span>
                  <span class="task-value">
                    <span>/</span>
                    <u>{{sport.measure}}</u>
                    <span class="task-unit">cm</span>
                  </span>
                </div>
              </div>
              <div class="task-num" v-else>
                <span class="task-name">目标:</span>
                <span class="task-value">{{sport.target}}
                  <span class="task-unit">{{sport.countType=='1'?'s':'个'}}</span>
                </span>
                <span class="task-name">成绩:</span>
                <span class="task-value">{{sport.countingNumber}}
                  <span class="task-unit">{{sport.countType=='1'?'个':'s'}}</span>
                </span>
                <span v-if="['09','10'].indexOf(sport.sportType)>-1" class="measure">
                  <span class="task-name">测量成绩:</span>
                  <span class="task-value">{{sport.measure}}
                    <span class="task-unit">cm</span>
                  </span>
                  <span v-if="list.validated=='0'" class="validate-btn" @click="validateClick(index)">校对</span>
                </span>
              </div>
              <div class="task-comment" v-if="sport.comments">活动情况:{{sport.comments}}</div>
              <div class="task-require" v-if="sport.requirements && !sport.trainingDate">{{sport.requirements}}</div>
              <div class="task-props" v-if="sport.sportPropsList && !sport.trainingDate">请准备 {{sport.sportPropsList}}
              </div>
              <!-- 原成绩 -->
              <div v-if="list.isWaitReplace=='1'" class="origin-task-detail">
                <div class="task-num " v-if="sport.sportType =='-2'">
                  <span class="task-name">成绩:</span>
                  <span class="task-value">
                    <u>{{sport.originCountingNumber}}</u>
                    <span class="task-unit">个</span>
                  </span>
                  <span class="task-value">
                    <span>/</span>
                    <u>{{sport.originExerciseTime}}</u>
                    <span class="task-unit">s</span>
                  </span>
                  <span class="task-value">
                    <span>/</span>
                    <u>{{sport.originMeasure}}</u>
                    <span class="task-unit">cm</span>
                  </span>
                  <span class="origin-task-text">原成绩</span>
                </div>
                <div class="task-num" v-if="sport.sportType !=='-2'">
                  <span class="task-name">目标:</span>
                  <span class="task-value">{{sport.target}}
                    <span class="task-unit">{{sport.countType=='1'?'s':'个'}}</span>
                  </span>
                  <span class="task-name">成绩:</span>
                  <span class="task-value">{{sport.originCountingNumber}}
                    <span class="task-unit">{{sport.countType=='1'?'个':'s'}}</span>
                  </span>
                  <span v-if="['09','10'].indexOf(sport.sportType)>-1" class="measure">
                    <span class="task-name">测量成绩:</span>
                    <span class="task-value">{{sport.originMeasure}}
                      <span class="task-unit">cm</span>
                    </span>
                  </span>
                  <span class="origin-task-text">原成绩</span>
                </div>
                <div class="task-comment" v-if="sport.originComments">
                  活动情况:{{sport.originComments}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="task-video">
          <van-tabs v-model="video.index" @click="changeTabs" v-show="videoList.length>1">
            <van-tab v-for="video,index in videoList" :key="index" :title="sportMap.get(video.sportType)" :name="index">
            </van-tab>
          </van-tabs>
          <video v-show="videoList.length>0" id="myVideo" ref="myVideo" class="video-js vjs-big-play-centered"
            :poster="video.videoPhotoUrl">
            <source :src="video.videoUrl" type="video/mp4">
          </video>
        </div>
        <div class="comment-content" v-if="commentList.length>0">
          <div class="comment-title">老师点评</div>
          <div class="comment-list">
            <div class="comment-item" v-for="comment in commentList" :key="comment.id">{{comment.detailComments}}</div>
          </div>
        </div>
      </section>
    </section>
    <section class="foot" v-if="list.isFinished =='0' ||  list.status!=='2' || list.validated=='0'">
      <van-button round block type="primary"
        :class="{'submit-btn primary-btn':true, 'primary-plain-btn':list.isFinished =='1' && list.validated=='0'}"
        :disabled="list.startStatus=='0'" v-if="list.isFinished =='0' || (list.isFinished=='1' && list.status!=='2')"
        @click="beginSport">
        <span v-if="list.isFinished=='0' && list.startTime">继续运动</span>
        <span v-else-if="list.isFinished=='0'">开始运动</span>
        <span v-else-if="list.isWaitReplace=='1'">替换成绩</span>
        <span v-else-if="list.isFinished=='1' && list.status!=='2'">再次运动</span>
      </van-button>
      <div v-if="list.status!=='2' && list.validated=='0'" class="split14"></div>
      <van-button round block type="primary" class="submit-btn primary-btn"
        v-if="list.isFinished =='1' && list.validated=='0'" @click="validateMeasure">
        <span>提交活动</span>
      </van-button>
    </section>
    <introduce-action-sheet :modelShow="modelShow" :modelData="modelData" :hideBtn="hideTeachBtn"
      @closeModel="closeModel">
    </introduce-action-sheet>
    <van-popup v-model="measure.showPicker" position="bottom">
      <van-picker class="measure-picker" ref="measurePicker" show-toolbar :columns="measure.columns"
        @cancel="measure.showPicker = false" title="校对测量成绩" @confirm="onMeasureConfirm" item-height=".845411rem" />
    </van-popup>
  </section>
</template>

<script>
import Video from 'video.js';
import 'video.js/dist/video-js.min.css';

import headTop from '@/components/header/head.vue';
import mIcon from '@/components/motion-icon/icon.vue';
import { getStore, removeStore } from "@/config/mUtil.js";
import { fileUrl } from "@/config/env.js";
import { sportList, videoOptions } from "@/config/constant.js";

// import { waitReplaceSportDetail } from '@/mock/mock.js';

export default {
  data() {
    return {
      list: {
        createMemberName: '',
        endDate: '',
        isFinished: '0',
        combinationSportDetailList: [],
        startDate: '',
        endDate: '',
        status: '0' // 完成状态
      },
      sportNoticeAndPropsResult: {}, // 运动道具准备 和 运动须知
      equipLIst: '', // 运动准备
      predictTime: 0, // 预计用时
      totalTime: 0, // 总用时
      videoList: [], // 运动视频
      video: { // 运动视频
        index: '',
        videoPhotoUrl: '',
        videoUrl: ''
      },
      modelShow: false, // 教程弹窗show
      modelData: {}, // 教程弹窗数据
      hideTeachBtn: true, // 隐藏教程弹窗组件按钮
      viewed: false, // 已检查
      commentList: [], // 点评列表
      measure: {//校对测量成绩弹窗
        showPicker: false,
        index: 0, // 
        sport: {},
        columns: [
          {
            values: ['+', '-'],
            defaultIndex: 0
          }]
      }
    }
  },
  computed: {
    endDate() {
      const arr = this.list.endDate.split("-");
      return arr[0] + '/' + arr[1] + '/' + arr[2]
    },
    finishedTime() {
      const arr = this.list.submitTime.split("-");
      return arr[0] + '/' + arr[1] + '/' + arr[2].slice(0, -3)
    },
    finishedNum() {
      let num = 0;
      for (const sport of this.list.combinationSportDetailList) {
        if (sport.trainingDate) {
          num++;
        }
      }
      return num
    },
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
      let mySet = new Set();
      let predictTime = 0;
      let totalTime = 0;
      let videoList = [];
      for (let sport of val) {
        if (sport.sportType !== '-1') {
          // 预计用时
          if (sport.sportType == '-2') {
            predictTime += parseInt(sport.targetTime)
          } else {
            predictTime += parseInt(sport.target)
          }

          // 运动总用时
          totalTime += parseInt(sport.exerciseTime);

          // 道具准备
          const arr = [];
          for (const notice of this.sportNoticeAndPropsResult[sport.sportType].sportPropsList) {
            mySet.add(notice.sportPropsName);
            arr.push(notice.sportPropsName)
          }
          if (arr.length > 0) {
            sport.sportPropsList = arr.join('、');
          }

          // 运动视频
          if (sport.videoPhotoUrl) {
            sport.videoPhotoUrl = fileUrl + sport.videoPhotoUrl;
            sport.videoUrl = fileUrl + sport.videoUrl;
            videoList.push(sport)
          }
        }
      }
      this.predictTime = predictTime;
      this.equipLIst = Array.from(mySet);
      this.videoList = videoList;
      this.totalTime = totalTime;
      if (this.videoList.length > 0) {
        this.video.index = 0;
        this.video.videoPhotoUrl = this.videoList[0].videoPhotoUrl;
        this.video.videoUrl = this.videoList[0].videoUrl;
        this.initVideo();
      }
      return val
    },
    'video.index'(val) {
      if (this.videoList.length > 0) {
        this.$set(this.video, 'videoUrl', this.videoList[val].videoUrl)
        this.$set(this.video, 'videoPhotoUrl', this.videoList[val].videoPhotoUrl);
        if (this.myPlayer) {
          this.myPlayer.src(this.video.videoUrl);
          this.myPlayer.poster(this.video.videoPhotoUrl);
        }
      }
    }
  },
  components: { headTop, mIcon, introduceActionSheet: () => import('@/components/introduce-actionsheet/actionsheet.vue') },
  created() {
    // 获取运动须知
    this.sportNoticeAndPropsResult = JSON.parse(getStore('sportNoticeAndPropsResult'));
    // 获取是否是再次运动替换成绩
    const waitReplaceSportDetail = JSON.parse(getStore("waitReplaceSportDetail")) || {};
    // 待替换
    if (waitReplaceSportDetail.isWaitReplace == '1') {
      this.list = waitReplaceSportDetail
    }
    else {
      // 正常活动列表点击进入详情页面 
      this.list = JSON.parse(getStore('taskDetail'));
      if (this.list.isFinished == '1') {
        this.getFinishedSportTaskDetail()
      }
    }

    // 计算活动是否开始 结束
    this.computedDate();
    // 校对下拉选
    this.initMeasureColumns();

    // 再次运动完成后进入详情页
    // 按钮：替换成绩 
    // 从store中获取原成绩 现成绩
    // 接口：replaceSportTaskDetail：param：{新运动trainingRecordId=22668, sportOrder=1}
    // 页面展示现成绩 原成绩
    // 若点击替换：重新请求getFinishedSportTaskDetail， 若点击返回按钮 弹窗提示是否替换成绩 若取消则返回列表页
    // 若不需要校对 正常显示按钮
    // 若需要校对，按钮为：再次运动和提交活动  页面测量成绩后显示校对按钮 点击提交活动：请求validateMeasures校对，测量成绩隐藏校对按钮，提交活动按钮隐藏
  },
  beforeDestroy() {
    if (this.myPlayer) {
      this.myPlayer.dispose();
    }
  },
  methods: {
    initMeasureColumns() {
      this.measure.columns.push(
        {
          values: [...Array(41).keys()],
          defaultIndex: 0
        }, {
        values: [...Array(10).keys()],
        defaultIndex: 0
      }
      );
    },
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
    // 比较时间 0未开始(开始剩余时) 1已开始未结束(截止剩余时间) 2已结束已过期...
    computedDate() {
      const data = this.list;
      const now = new Date().getTime();
      const startDate = new Date(data.startDate + ' 00:00:00').getTime();
      const endDate = new Date(data.endDate + ' 23:59:59').getTime();
      let status;
      if (startDate > now) {
        status = '0';
      } else if (startDate <= now && now <= endDate) {
        status = '1';
      } else {
        status = '2'
      }
      this.list.status = status;
    },
    sportTeachClick(e) {
      e.sportname = this.sportNoticeAndPropsResult[e.sportType].sportName;
      this.modelData = e;
      this.modelShow = true;
      this.hideTeachBtn = true
    },
    closeModel() {
      this.modelShow = false
    },
    changeTabs() { },
    beginSport() {
      if (this.list.isWaitReplace == '1') {
        this.$dialog.confirm({
          title: "替换成绩",
          message: "是否替换历史成绩!",
          className: "replace-dialog",
          confirmButtonText: "取消",
          cancelButtonText: "确认"
        }).then(() => {
          console.log("取消");
          removeStore("waitReplaceSportDetail");
          this.$refs.head.goBackThing();
        }).catch(() => {
          console.log("确认");
          this.replaceSportTaskDetail();
          removeStore("waitReplaceSportDetail");
        })
      }
    },
    // 替换成绩
    replaceSportTaskDetail() {
      // this.$api.replaceSportTaskDetail({}).then(res => {
      // this.getFinishedSportTaskDetail()
      // })
    },
    validateClick(index) {
      let data = this.list.combinationSportDetailList[index].measure;
      this.measure.sport[index] = this.list.combinationSportDetailList[index];
      this.measure.index = index;
      this.measure.showPicker = true;
      this.$nextTick(() => {
        let sysmbols;
        if (data.indexOf('-') > -1) {
          sysmbols = data.charAt(0);
          data = data.substring(1);
        } else {
          sysmbols = '+'
        }
        const arr = data.split(".");
        this.$refs.measurePicker.setValues([sysmbols, parseInt(arr[0]), parseInt(arr[1]) || 0]);
      })
    },
    onMeasureConfirm(e) {
      const { sport, index } = this.measure;
      const result = (e[0] == '-' ? '-' : '') + e[1] + '.' + e[2];
      this.measure.sport[index].measure = result;
      this.list.combinationSportDetailList[index] = sport[index]
      this.measure.showPicker = false;
      this.$store.dispatch("task/changeRefresh", true)
    },
    // 提交活动 提交校验测量成绩
    validateMeasure() {
      const { sport } = this.measure;
      const arr = [];
      for (let key in sport) {
        arr.push({
          combinationSportDetailId: sport[key].id,
          measure: sport[key].measure
        })
      }
      this.$api.validateMeasures({
        combineId: sport.combineId, combinationSportDetail: arr
      }).then(res => {
        this.list.validated = '1';
        // 遗留内容： 校验完成后  commit更改对应task状态 清除task相关缓存
        this.$store.dispatch("task/changeRefresh", true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
.child_page{
  overflow: auto;
}
header /deep/ {
  background-color: $maincolor;
  color: $white;
  .covers_name span, .goback{
    color: $white;
  }
}
.content{
  padding-top: 1.256039rem;
  .overview{
    height: 2.415459rem;
    background-color: $maincolor;
    display: flex;
    align-items: baseline;
    .card{
      flex:1 0 0;
      padding: .386473rem 0 0 .386473rem;
      width: 0; //防止老师名字过长被挤压
      .title{
        @include sizeColor(.434783rem, $white);
        font-weight: bold;
        margin-bottom: .241546rem;
        @include ellipsis;
        .total{
          font-size: .338164rem;
          font-weight: 500;
        }
      }
      .explain{
        @include sizeColor(.362319rem, $white3);
        font-weight: 500;
      }
    }
  }
  .no-btn{
    margin-bottom: .483092rem !important;
  }
  .content-detail{
    margin-top: -0.483092rem;
    padding: .483092rem .386473rem 0rem;
    margin-bottom: 2.173913rem;
    background-color: $bgcolor;
    border-radius: .483092rem .483092rem 0 0;
    .title{
      @include sizeColor(.434783rem, $black1);
      font-weight: bold;
    }
    .statistic{
      display: flex;
      margin-top: .483092rem;
      .card{
        background-color: $bgcolor3;
        border-radius: .241546rem;
        padding: .338164rem .386473rem;
        flex-shrink: 0;
        font-weight: 500;
        &:first-child{
          margin-right: .2657rem;
          .title::before{
            background-color: $blue;
          }
        }
        &:last-child{
          .title::before{
            background-color: $maincolor;
          }
        }
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
    }
    .big-card{
      flex:1
    }
    .small-card{
      flex-basis: 2.898551rem;
      flex-shrink: 0;
    }
    .prepare .big-card{
      .detail{
        @include sizeColor(.362319rem, $black1);
        font-weight: bold;
      }
    }
    // 点评
    .comment-content{
      .comment-title{
        padding: .362319rem 0;
        @include sizeColor(.434783rem, $black1);
        font-weight: bold;
      }
      .comment-item{
        padding: .241546rem;
        @include sizeColor(.362319rem, $black2);
        position: relative;
        background-color: $bgcolor3;
        border-radius: 0 .120773rem .120773rem 0rem;
        &::before{
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: .048309rem;
          border-radius: .024155rem;
          height: 100%;
        }
        &:not(:first-child){
          margin-top: .241546rem;
        }
        &:first-child::before{
          background-color: $blue;
        }
        &:nth-child(2)::before{
          background-color: $red;
        }
        &:nth-child(3)::before{
          background-color: $maincolor;
        }
        &:nth-child(4)::before{
          background-color: $green;
        }
      }
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
        .task-teach{
          margin-left: .072464rem;
          @include sizeColor(.289855rem, $white);
          padding: .048309rem .193237rem;
          border-radius: .217391rem;
          background-color: $maincolor;
        }
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
        .validate-btn{
          padding: .048309rem .169082rem;
          border: .024155rem solid $maincolor;
          border-radius: .241546rem;
          color: $maincolor;
          font-weight: bold;
        }
        .measure{
          padding-left: .241546rem;
        }
      }
      .task-comment{
        @include sizeColor(.362319rem, $black4);
      }
      .task-require{
        margin-top: .241546rem;
        @include sizeColor(.338164rem, $black2);
      }
      .task-props{
        padding: .241546rem;
        margin-top: .241546rem;
        border-radius: .241546rem;
        background-color: $bgcolor3;
        @include sizeColor(.289855rem, $black3);
      }
    }
  }
  .origin-task-detail{
    opacity: 0.5;
    .origin-task-text{
      display: inline-block;
      @include sizeColor(.289855rem, $black6);
      padding: .024155rem .217391rem;
      background-color: rgba($color: $black6, $alpha: 0.32);
      border-radius: .217391rem;
      margin-left: .193237rem;
    }
  }
}
.task-video{
  @include widthHeight(100%,auto);
}
.van-tabs /deep/{
  .van-tab{
    font-size: .362319rem;
  }
  .van-tab--active{
    font-size: .434783rem;
  }
}
.foot{
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 2.173913rem;
  padding: 0 .386473rem;
  display: flex;
  background: -webkit-gradient(linear, 0% 0%, 0% 100%, color-stop(0, rgba(255,255,255,0.1)),color-stop(0.2, rgba(255,255,255,0.9)), color-stop(1, rgba(255,255,255,1)));
  .submit-btn{
    margin-top: .483092rem;
    height: 1.062802rem !important;
    flex: 1;
  }
}
.measure-picker /deep/{
  .van-picker-column__item{
    font-size: .483092rem;
  }
  .van-picker-column__item--selected{
    font-size: .57971rem;
  }
}
</style>
<style lang="scss">
.replace-dialog{
  width: 4.830918rem !important;
}
</style>