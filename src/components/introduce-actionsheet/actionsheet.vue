<template>
  <van-action-sheet v-if="show" v-model="show" class="model-actionsheet" :title="modelData.sportname"
    style="height: 70%" :close-on-click-overlay="false" :close-on-popstate="true" @cancel="closeModel">
    <div :class="{'actionsheet-body':true, 'hide-btn':hideBtn}">
      <video v-if="model.sportNoticeVideoUrl" :src="model.sportNoticeVideoUrl" class="video" autoplay controls></video>
      <van-image v-else
        :src="fileUrl+(sportNoticeAndPropsResult[modelData.sportType]?sportNoticeAndPropsResult[modelData.sportType].sportNoticeImgUrl:'')">
      </van-image>
      <div v-if="model.sportTargetList.length>0">
        <div class="node-title">训练目标</div>
        <ul>
          <li v-for="item in model.sportTargetList" :key="item.targetOrder">{{item.targetContent}}</li>
        </ul>
      </div>
      <div v-if="model.sportKeyPointList.length>0">
        <div class="node-title">训练要领</div>
        <ul>
          <li v-for="item in model.sportKeyPointList" :key="item.pointOrder">{{item.pointContent}}</li>
        </ul>
      </div>
      <div v-if="model.sportPropsList.length>0">
        <div class="node-title">道具准备</div>
        <ul>
          <li v-for="item in model.sportPropsList" :key="item.sportPropsOrder">{{item.sportPropsName}}</li>
        </ul>
      </div>
      <div v-if="model.sportScorePointList.length>0">
        <div class="node-title">得分标准</div>
        <ul>
          <li v-for="item in model.sportScorePointList" :key="item.scorePointOrder">{{item.scorePointContent}}</li>
        </ul>
      </div>
    </div>
    <div class="actionsheet-button" v-if="!hideBtn">
      <van-button round block type="primary" class="submit-btn" @click="toPublish">开始</van-button>
    </div>
  </van-action-sheet>
</template>

<script>
import { fileUrl } from '@/config/env.js';
import { getStore, setStore } from '@/config/mUtil.js'
export default {
  data() {
    return {
      sportIntroductionInfo: {},
      sportNoticeAndPropsResult: {},
      fileUrl: fileUrl,
      model: {
        sportName: "",
        id: "",
        sportNoticeVideoUrl: "", // 视频
        sportTargetList: [], // 训练目标
        sportKeyPointList: [], // 训练要领,
        sportPropsList: [], // 道具准备
        sportScorePointList: [] // 得分标准
      },
      show: false,
      fileUrl: fileUrl
    }
  },
  watch: {
    modelData(val) {
      if (!val) {
        return
      }
      this.sportClick();
    },
    modelShow(val) {
      if (val) {
        this.show = true
      } else {
        this.show = false
      }
    }
  },
  props: ['modelData', 'modelShow', 'hideBtn'],
  created() {
    this.sportIntroductionInfo = JSON.parse(getStore('getNoticeAndPropsBySportType')) || {};
    this.sportNoticeAndPropsResult = JSON.parse(getStore('sportNoticeAndPropsResult')) || {};
  },
  methods: {
    sportClick() {
      console.log(this.modelData)
      const e = this.modelData;
      this.model.sportName = e.sportname;
      this.model.id = e.sportType;
      if (this.sportIntroductionInfo[e.sportType]) {
        this.model = this.sportIntroductionInfo[e.sportType];
        return
      }
      this.$api.getNoticeAndPropsBySportType({ sportType: e.sportType }).then(res => {
        res.data.sportNoticeVideoUrl = res.data.sportNoticeVideoUrl ? fileUrl + res.data.sportNoticeVideoUrl : null;
        this.model = res.data;
        this.$set(this.sportIntroductionInfo, e.sportType, res.data);
        setStore('getNoticeAndPropsBySportType', this.sportIntroductionInfo)
      })
    },
    closeModel() {
      this.$emit('closeModel')
    },
    toPublish() {
      this.$router.push({
        path: "/training/publish",
        query: {
          sportType: this.model.id,
          type: "1" //运动1 作业2
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "static/css/public.scss";
.model-actionsheet{
  .van-action-sheet__content{
    overflow: hidden;
  }
  .actionsheet-body{
    height: calc(100% - 1.690821rem) !important;
    max-height: fit-content;
  }
  .hide-btn{
    height: 100% !important;
  }
  .video{
    @include widthHeight(100%, 5.676329rem);
    border-radius: .241546rem;
    object-fit: cover;
  }
  .van-image{
    @include widthHeight(100%, 5.676329rem);
    border-radius: .241546rem;
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