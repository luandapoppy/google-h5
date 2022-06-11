<template>
  <section class="child_page">
    <head-top crossover="邀请函"></head-top>
    <div class="body-content">
      <div class="card-container">
        <div class="logo">
          <img src="/static/image/invite_logo.png" />
          <span>让运动变得更简单</span>
        </div>
        <div class="card-content">
          <h2>同学</h2>
          <h3>你有一份邀请函待查收~</h3>
          <h4>老师诚挚邀请您加入</h4>
          <img src="/static/image/invite_arrow.png" alt="" />
          <div id="school">
            {{ info.schoolName }}
          </div>
          <div id="district">
            {{ info.provinceName }}，{{ info.cityName }}，{{ info.countryName }}
          </div>

          <img src="/static/image/invite_arrow.png" alt="" v-if="classVisible" />
          <div id="classroom" v-if="classVisible">
            <span>{{ info.gradeName + info.className }}</span>
          </div>
          <div class="people" :style="'margin-bottom:' + (classVisible?'':'.7246rem')">
            <span id="people"> {{ info.joinStuNums }}人 </span>
            <span> 已加入 </span>
          </div>
        </div>
        <div class="button" v-if="!expired">
          <button class="btn" @click="certifyClick"></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import headTop from '@/components/header/head.vue';
export default {
  data() {
    return {
      info: {
        areaInfo: "",
        cityName: "",
        className: "",
        countryName: "",
        gradeName: "",
        joinStuNums: 0,
        provinceName: "",
        schoolClassId: 0,
        schoolName: "",
      },
      schoolId: "926",
      schoolClassId: "135",
      classVisible: true,
      expired: false
    };
  },
  components: { headTop },
  mounted() {
    // schoolId=926&schoolClassId=135&createTime=1641803590442
    // this.schoolId = this.$route.query.schoolId;
    // this.schoolClassId = this.$route.query.schoolClassId;
    // this.createTime = this.$route.query.createTime;

    this.getMergeInfo();
    const createTime = parseInt("1641803590442");
    const nowtime = new Date().getTime();
    const day = (nowtime - createTime) / (1000 * 60 * 60 * 24);
    if (day > 5) {
      this.$toast("邀请码已过期");
      this.expired = true
    }
  },
  methods: {
    getMergeInfo() {
      this.$api.getInviteInfo({
        schoolId: this.schoolId,
        schoolClassId: this.schoolClassId,
      }).then((res) => {
        if (res.code == "0") {
          let data = res.data;
          this.$set(this, "info", data);
          if (!data.gradeName) {
            this.$set(this, "classVisible", false);
          }
        }
      });
    },
    certifyClick() {
      this.$router.push({
        path: "/my/member/addschool/certify",
        query: {
          schoolId: this.schoolId,
          schoolClassId: this.schoolClassId,
          type: "0" //扫一扫
        }
      })
    }
  },
};
</script>


<style lang="scss" scoped>
@import "static/css/public.scss";
header{
  background: transparent;
}
.body-content {
  @include widthHeight(100%, 100%);
  background: url("https://files.cnaiks.com/0_AIKS_IMG/webfront/invite-bg.jpg") no-repeat 0% bottom / 100% 100%;
  box-sizing: border-box;
  padding-top: 1.2077rem;
}

.card-container {
  width: 100%;
  height: 100%;
  background: url("https://files.cnaiks.com/0_AIKS_IMG/webfront/invite-letter.png") no-repeat 0% 0% / 100% 100%;
  padding: .4831rem .8454rem .8454rem;
  box-sizing: border-box;
  color: #34322E;
}

.logo {
  display: flex;
  align-items: center;
  img {
    padding-right: .1932rem;
    border-right: .0242rem solid #cbcbcb;
    height: .4831rem;
    vertical-align: middle;
  }
  span {
    font-size: .3382rem;
    padding-left: .1932rem;
  }
}
.card-content {
  text-align: center;
}

.card-content h2 {
  font-size: .5797rem;
  font-weight: bold;
  margin-top: .7246rem;
}

.card-content h3 {
  color: $black5;
  font-size: .3865rem;
  font-weight: 500;
  margin-top: .3382rem;
}

.card-content h4 {
  font-size: .4348rem;
  font-weight: 500;
  margin-top: .7246rem;
}

.card-content img {
  height: .7971rem;
  margin-top: .2415rem;
}

#school {
  color: $maincolor;
  font-size: .5797rem;
  margin-bottom: .2899rem;
}

#district {
  color: $black5;
  font-size: .3623rem;
  margin-top: .2899rem;
}


#classroom span {
  font-size: .4348rem;
  padding: .3865rem .8454rem;
  border: .0242rem dashed $maincolor;
  box-sizing: border-box;
  border-radius: .1208rem;
  display: inline-block;
}

.people {
  color: $black6;
  font-size: .3382rem;
  margin-top: .2415rem;
}

#people {
  color: $maincolor;
}

.card-container .button {
  text-align: center;
}

.card-container button {
  border: 0;
  background: transparent url("/static/image/invite_btn.png") no-repeat 0 0 / 100%
    100%;
  outline: none;
  width: 4.8309rem;
  height: 1.1353rem;
  margin-top: .7246rem;
}
</style>