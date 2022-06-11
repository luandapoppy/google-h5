<template>
  <section>
    <head-top :crossover="'设定'+(type=='1'?'运动目标':'作业')" guide="true" customer="true"></head-top>
    <section class="content">
      <div class="task-item" v-for="item,index in list">
        <div class="title" v-if="item.sportType !== '-1'">
          <m-icon class="sport-img" :sportType="item.sportType" :type="4"></m-icon>
          <span>
            {{item.sportName}}
          </span>
          <div class="tool">
            <i v-if="index>0 && list.length>1" class="ks-icon ks-icon-shangsheng" @click="upClick(index)"></i>
            <i v-if="index<list.length-1 && list.length>1" class="ks-icon ks-icon-xiajiang"
              @click="downClick(index)"></i>
            <i v-if="list.length>1" class="ks-icon ks-icon-shanchu" @click="deleteClick(index)"></i>
          </div>
        </div>
        <div class="detail" v-if="item.sportType !== '-1'">
          <div class="tabs">
            <van-tabs v-model="item.countType" swipeable>
              <van-tab title="时长" name="1"></van-tab>
              <van-tab title="个数" name="0"></van-tab>
            </van-tabs>
          </div>
          <!-- 时长 -->
          <div v-show="item.countType == '1'" class="num-wrapper">
            <div class="stepper">
              <van-stepper v-model="item.time" step="30" min="0" max="180" integer />
              <span class="unit">秒</span>
            </div>
            <div class="shortcut">
              <van-button v-for="step,idx in shortcut.time" :key="idx" @click="shortcutClick(index,step)">{{step}}
                <span class="unit">秒</span>
              </van-button>
            </div>
          </div>
          <!-- 个数 -->
          <div v-show="item.countType == '0'" class="num-wrapper">
            <div class="stepper">
              <van-stepper v-model="item.num" step="30" min="0" max="1000" integer />
              <span class="unit">个</span>
            </div>
            <div class="shortcut">
              <van-button v-for="step,idx in shortcut.num" :key="idx" @click="shortcutClick(index,step)">{{step}}
                <span class="unit">个</span>
              </van-button>
            </div>
          </div>
        </div>
        <div class="relax" v-if="item.sportType == '-1'">
          <div class="relax-title">休息时间</div>
          <div class="stepper">
            <van-stepper v-model="item.target" theme="round" step="30" min="0" max="180" integer />
            <span class="unit">秒</span>
          </div>
        </div>
      </div>
      <van-button class="add-btn primary-small-btn" round block type="primary" icon="plus" @click="addClick">添加运动
      </van-button>
    </section>
    <section class="foot">
      <van-button round block type="primary" class="submit-btn primary-btn" @click="beginSport">
        开始运动</van-button>
    </section>
    <!-- 添加运动弹窗 -->
    <van-action-sheet v-model="model.show" class="model-actionsheet" :closeable="false" @click-overlay="cancleAdd">
      <van-tabs v-model="model.tabActive" swipeable>
        <van-tab title="单项运动" name="1">
          <van-swipe class="my-swipe">
            <!-- 每页swipe展示六项运动 -->
            <van-swipe-item v-for="(item,index) in singlesportList.length" :key="index"
              v-if="index.toString()=='0' || index%6 == 0">
              <van-grid :border="false" :column-num="3" :gutter="10">
                <van-grid-item v-for="num,n in 6" v-if="singlesportList[index+n]" :key="n"
                  :class="model.singleActiveIndex==(index+n)?'grid-item-avtive':''"
                  @click="sportgridClick(index+n, '1')">
                  <template #icon>
                    <m-icon :sportType="singlesportList[index+n].sportType" :type="4"></m-icon>
                  </template>
                  <template #text>
                    {{singlesportList[index+n].sportName}}
                  </template>
                </van-grid-item>
              </van-grid>
            </van-swipe-item>
          </van-swipe>
        </van-tab>
        <van-tab title="体验运动" name="2">
          <van-swipe class="my-swipe">
            <!-- 每页swipe展示六项运动 -->
            <van-swipe-item v-for="(item,index) in experienceList.length" :key="index"
              v-if="index.toString()=='0' || index%6 == 0">
              <van-grid :border="false" :column-num="3" :gutter="10">
                <van-grid-item v-for="num,n in 6" v-if="experienceList[index+n]" :key="n"
                  :class="model.experienceActiveIndex==(index+n)?'grid-item-avtive':''"
                  @click="sportgridClick(index+n, '2')">
                  <template #icon>
                    <m-icon :sportType="experienceList[index+n].sportType" :type="4"></m-icon>
                  </template>
                  <template #text>
                    {{experienceList[index+n].sportName}}
                  </template>
                </van-grid-item>
              </van-grid>
            </van-swipe-item>
          </van-swipe>
        </van-tab>
      </van-tabs>
      <div class="actionsheet-button">
        <van-button round block type="primary" class="submit-btn primary-plain-btn primary-btn" @click="cancleAdd">取消添加
        </van-button>
        <van-button round block type="primary" class="submit-btn primary-btn" @click="confirmAdd">确认添加</van-button>
      </div>
    </van-action-sheet>
  </section>
</template>

<script>
import headTop from '@/components/header/head.vue';
import mIcon from '@/components/motion-icon/icon.vue';
import { sportList } from '@/config/constant.js';
import { setStore } from '@/config/mUtil.js';
export default {
  data() {
    return {
      type: "1",// 运动1 作业2
      sportType: "", // query传来的运动类型参数
      list: [], // 添加运动列表
      shortcut: {// 快捷按钮
        time: [30, 60, 90, 120, 150, 180],
        num: [10, 20, 30, 40, 50, 60]
      },
      model: {// 添加弹窗
        show: false,// 添加运动弹窗显示
        tabActive: "1",// 添加运动tab
        singleActiveIndex: -1, // 添加运动 选中单项运动
        experienceActiveIndex: -1, // 添加运动 选中体验运动
      },
      singlesportList: [], // 单项运动列表
      experienceList: [] // 体验运动列表
    }
  },
  components: { headTop, mIcon },
  mounted() {
    this.type = this.$route.query.type;
    this.sportType = this.$route.query.sportType;
    let arr = [];
    let singlesportList = [];
    let experienceList = [];
    sportList.forEach(item => {
      if (item.sportType == this.sportType) {
        arr.push({
          ...item,
          time: 60,
          num: 0,
          countType: '1' //计时1 计数0
        })
      }
      if (item.sportSortId == '1') {
        singlesportList.push(item)
      } else if (item.sportSortId == '2') {
        experienceList.push(item)
      }
    });
    this.list = arr;
    this.singlesportList = singlesportList;
    this.experienceList = experienceList;
  },
  methods: {
    // 上升
    upClick(index) {
      const list = this.list;
      let temp = JSON.parse(JSON.stringify(list[index]));
      this.$set(this.list, index, list[index - 2]);
      this.$set(this.list, index - 2, temp);
    },
    // 下降
    downClick(index) {
      const list = this.list;
      let temp = JSON.parse(JSON.stringify(list[index]));
      this.$set(this.list, index, list[index + 2]);
      this.$set(this.list, index + 2, temp);
    },
    // 删除
    deleteClick(index) {
      if (index < this.list.length - 1) {
        this.list.splice(index, 2)
      } else {
        this.list.splice(index - 1, 2)
      }
    },
    // 添加运动
    addClick() {
      this.model.show = true;
    },
    // 快捷按钮点击
    shortcutClick(index, step) {
      const list = this.list;
      if (list[index].countType == '1') {
        list[index].time = step
      } else {
        list[index].num = step
      }
    },
    // 运动类型点击
    sportgridClick(index, type) {
      // 单项运动
      if (type == '1') {
        this.model.experienceActiveIndex = -1;
        var active = 'singleActiveIndex';
      } else {// 体验运动
        this.model.singleActiveIndex = -1;
        var active = 'experienceActiveIndex';
      }
      if (this.model[active] == index) {
        this.model[active] = null;
      } else {
        this.model[active] = index
      }

    },
    // 取消添加
    cancleAdd() {
      this.model.show = false;
      this.model.singleActiveIndex = -1;
      this.model.experienceActiveIndex = -1;
    },
    // 确认添加
    confirmAdd() {
      const { singleActiveIndex, experienceActiveIndex } = this.model;
      if (singleActiveIndex > -1) {
        // 休息时间
        this.list.push({
          sportType: '-1',
          target: 60
        });
        this.list.push({
          ...this.singlesportList[singleActiveIndex],
          time: 60,
          num: 0,
          countType: '1' //计时1 计数2
        })
        this.cancleAdd();
      } else if (experienceActiveIndex > -1) {
        // 休息时间
        this.list.push({
          sportType: '-1',
          target: 60
        });
        this.list.push({
          ...this.singlesportList[experienceActiveIndex],
          time: 60,
          num: 0,
          countType: '1' //计时1 计数2
        }
        )
        this.cancleAdd();
      } else {
        this.$toast("请选择要添加的运动!")
      }
    },
    beginSport() {
      const list = this.list;
      setStore('sportList', list);
      this.$router.push({
        path: '/sport',
        query: {
          type: list.length > 1 ? '1' : '0' // 0单项运动 1组合运动
        }
      })

      // this.$post("sport/addCombinationSports", {
      //   combinationSportDetails:[

      //   ]
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
.content{
  padding: 1.449275rem .386473rem 2.294686rem;
  text-align: center;
  .add-btn{
    display: inline-block;
    margin-top: .966184rem;
  }
}
.task-item{
  background: $bgcolor;
  box-shadow: 0 0 .966184rem .024155rem rgba($color: #211E1E, $alpha: 0.05);
  border-radius: .241546rem;
  margin-top: .483092rem;
  .title{
    display: flex;
    background-color: #FFF2E5;
    height: 1.304348rem;
    padding: .193237rem 0 0 .338164rem;
    @include sizeColor(.434783rem, $maincolor);
    font-weight: bold;
    border-radius: .241546rem .241546rem 0 0;
    .sport-img{
      @include widthHeight(.57971rem,.57971rem);
      vertical-align: bottom;
      margin-right: .193237rem;
    }
    .tool{
      flex:1;
      text-align: right;
      margin-right: .338164rem;
      font-weight: normal;
      @include  sizeColor(.434783rem, #b1b2b3);
      .ks-icon:not(:last-child){
        margin-right: .362319rem;
      }
    }
  }
  .detail{
    padding: 0 .386473rem .483092rem;
    margin-top: -0.31401rem;
    background-color: $bgcolor;
    border-radius: .241546rem .241546rem 0 0;
    .tabs /deep/ {
      .van-tabs__nav{
        width: 3.140097rem;
        margin: 0 auto;
      }
      .van-tab{
        @include sizeColor(.362319rem, $black5);
        padding: 0;
        max-width: inherit;
      }
      .van-tab--active{
        @include sizeColor(.362319rem, $black4);
      }
      .van-tabs__line{
        width: .724638rem;
      }
    }
  }
  // 步进器
  .stepper /deep/{
    text-align: center;
    position: relative;
    .unit{
      @include sizeColor(.338164rem, $black6);
      position: absolute;
      left: 50%;
      bottom: .120773rem;
      transform: translateX(1.449275rem);
    }
    .van-stepper{
      width: fit-content;
      display: inline-block;
    }
    .van-stepper__input{
      @include sizeColor(.966184rem, $black4);
      @include widthHeight(2.415459rem,auto);
      background-color: transparent;
      border-bottom: 1PX solid $gray1;
      font-weight: bold;
    }
    .van-stepper__minus, .van-stepper__plus{
      color: $maincolor;
      border-radius: .120773rem;
      background-color: $bgcolor;
      border: 1PX solid $maincolor;
      @include widthHeight(.748792rem,.748792rem);
    }
    .van-stepper__minus{
      margin-right: 1.207729rem;
    }
    .van-stepper__plus{
      margin-left: 1.207729rem;
    }
    .van-stepper__minus--disabled, .van-stepper__plus--disabled{
      border-color: $gray2;
      color: $black6;
    }
  }
  // 休息时间
  .relax{
    padding: .483092rem .338164rem;
    display: flex;
    .relax-title{
      @include sizeColor(.434783rem, $black5);
      font-weight: bold;
    }
    .stepper /deep/{
      flex:1;
      text-align: right;
      .unit{
        font-size: .289855rem;
        position: absolute;
        right: 1.086957rem;
        left: 0;
        transform: none;
      }
      .van-stepper__input{
        @include sizeColor(.676329rem, $black5);
        @include widthHeight(1.690821rem,auto);
        font-weight: 500;
      }
      .van-stepper__minus, .van-stepper__plus{
        color: $black6;
        border-radius: 50%;
        border-color: $gray2;
        @include widthHeight(.57971rem,.57971rem);
      }
      .van-stepper__minus{
        margin-right: .724638rem;
      }
      .van-stepper__plus{
        margin-left: .724638rem;
      }
    }
  }
  .num-wrapper{
    margin-top: .724638rem;
    // 快捷tag
    .shortcut{
      text-align: center;
      padding-top: .724638rem;
      background: url("./image/arrow.png") center top / 100% auto no-repeat;
      button{
        background-color: #FAEFE5;
        border-radius: .120773rem;
        border:0;
        @include widthHeight(1.207729rem, .57971rem);
        padding: 0;
        &:not(:last-child){
          margin-right: .241546rem;
        }
      }
      .van-button__text{
        @include sizeColor(.338164rem, $maincolor);
        .unit{
          font-size: .241546rem;
        }
      }
    }
  }
}
.foot{
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 2.173913rem;
  padding: 0 .386473rem;
  background-color: $bgcolor;
  .submit-btn{
    margin-top: .241546rem;
  }
}
.model-actionsheet {
  .van-tabs{
    padding: .434783rem .57971rem 0;
  }
  // padding: .434783rem .57971rem 0;
  .my-swipe{
    height: 5.072464rem;
    .van-grid{
      padding-top: .241546rem;
      .van-grid-item /deep/{
        .van-grid-item__content{
          padding: .241546rem .193237rem;
          @include sizeColor(.362319rem, #333);
          border: 1PX solid transparent;
        }
      }
      .grid-item-avtive /deep/ .van-grid-item__content{
        border-color: $maincolor;
        border-radius: .144928rem;
        box-sizing: border-box;
        background:url("./image/active.png") right top / .483092rem .483092rem no-repeat;
      }
    }
    .van-image{
      @include widthHeight(.724638rem,.724638rem)
    }
  }
  .actionsheet-button{
    border-top: 0;
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