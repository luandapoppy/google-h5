<template>
  <section class="child_page">
    <head-top ref="head" :crossover="'我的成员('+members.length+')'"></head-top>
    <section class="member-list">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
        <div class="profile current-member" v-if="currentMember.memberId" @click="editMember('1', currentMember)">
          <profile-icon :url="currentMember.memberPhotoUrl" />
          <div class="profile-detail">
            <div class="name">
              <span class="ellipsis">{{currentMember.memberName}}</span>
              <img v-if="currentMember.certifiedType =='0'" src="/static/image/student.png" alt="">
              <img v-if="currentMember.certifiedType =='1'" src="/static/image/teacher.png" alt="">
              <span class="tag">当前成员</span>
            </div>
            <div class="school ellipsis">
              {{formatSchool(currentMember)}}</div>
          </div>
        </div>
        <div v-for="item in members" :key="item.memberId">
          <van-swipe-cell v-if="item.memberId !== currentMember.memberId">
            <div class="profile" @click="editMember('1', item)">
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
            </div>
            <template #right v-if="item.certifiedType && item.certifiedType!=='-1'">
              <van-button text="切换为此成员" type="primary" class="swipe-button switch-current-button"
                @click="switchMember(item)" />
            </template>
            <template #right v-else>
              <van-button text="加入学校" type="info" class="swipe-button add-school-button" @click="addSchool(item)" />
              <van-button text="切换为此成员" type="primary" class="swipe-button switch-current-button"
                @click="switchMember(item)" />
              <van-button text="删除" type="danger" class="swipe-button delete-button" @click="deleteMember(item)" />
            </template>
          </van-swipe-cell>
        </div>
      </van-pull-refresh>
    </section>
    <section class="foot">
      <van-button round block type="primary" icon="add-o" class="submit-btn primary-info-btn primary-btn"
        @click="editMember('0')">添加成员
      </van-button>
    </section>
    <transition name="router-show">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import headTop from '@/components/header/head.vue';
import profileIcon from '@/components/profile-icon/icon.vue';
import { getStore, setStore } from "@/config/mUtil.js";

export default {
  data() {
    return {
      refreshLoading: false
    }
  },
  computed: {
    ...mapGetters({
      currentMember: "member/getCurrentMember",
      members: "member/getMembers"
    })
  },
  components: { headTop, profileIcon },
  methods: {
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
    // 下拉刷新
    onRefresh() {
      const profile = JSON.parse(getStore("userProfile"));
      this.$api.getMembers({ trainingUserId: profile.userId }).then(res => {
        const data = res.data;
        this.$store.dispatch("member/changeMembers", data);
        const currentMember = data.find(item => item.memberId == this.currentMember.memberId) || {};
        this.currentMember = currentMember;
        this.refreshLoading = false;
      }).catch(err => {
        this.refreshLoading = false;
        this.$toast(err.msg)
      })
    },
    // 加入学校
    addSchool(data) {
      this.$router.push({
        path: '/my/member/detail/addschool',
        query: {
          memberId: data.memberId
        }
      })
    },
    // 切换为该成员
    switchMember(data) {
      this.$store.dispatch("member/changeCurrentMember", data)
    },
    // 删除成员
    deleteMember(data) {
      this.$dialog.confirm({
        title: "提示",
        message: "确认删除该成员?",
        className: "delete-member-dialog",
      }).then(() => {
        this.$api.batchDeleteMemberByIds({ memberIds: [data.memberId] }).then(() => {
          const members = this.members.filter(item => item.memberId !== data.memberId);
          this.$store.dispatch("member/changeMembers", members)
        })
      }).catch(() => {
        console.log("取消");
      })
    },
    // 添加成员
    editMember(type, data) {
      const query = { type: type }
      if (type !== '0') {
        query.memberId = data.memberId
      }
      this.$router.push({
        path: "/my/member/detail",
        query: query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
.member-list{
  overflow: auto;
  padding-top: 1.304348rem;
  max-height: calc(100% - 1.932367rem);
}
.current-member{
  background: $bgcolor3 !important;
  .tag{
    @include sizeColor(.289855rem, #09BB08);
    padding: .048309rem .169082rem;
    background: #E6F6E6;
    border-radius: .2657rem;
    font-weight: 500;
    margin-left: .1932rem
  }
}
.profile{
  @include align;
  padding: .2657rem .386473rem;
  background: $bgcolor;
  position: relative;
  &::after{
    content: '';
    position: absolute;
    left: 1.932367rem;
    bottom: 0;
    right: 0;
    height: .024155rem;
    background-color: $gray1;
    transform: scaleY(0.5)
  }
  >.van-image{
    @include widthHeight(1.207729rem, 1.207729rem);
    border: 0;
    flex-shrink: 0;
  }
  .profile-detail{
    @include justify(center);
    width: calc(100% - 3.719807rem);
    flex: 1;
    flex-direction: column;
    margin-left: .338164rem;
    .name{
      @include sizeColor(.410628rem, #34322E);
      margin-bottom: 0rem;
      line-height: .57971rem;
      font-weight: bold;
      @include align;
      span{
        max-width: calc(100% - 2.415459rem);
        display: inline-block;
      }
      img{
        @include widthHeight(1.376812rem, .507246rem);
        margin: 0 .193237rem;
      }
      .ks-icon{
        @include sizeColor(.338164rem, $black6)
      }
    }
    .school{
      @include sizeColor(.338164rem, $black6);

    }
  }
}
.van-swipe-cell /deep/{
  .van-swipe-cell__right{
    display: flex;
  }
}
.swipe-button{
  height: 100%;
  border-radius: 0;
  .van-button__text{
    font-size: .434783rem;
  }
}
.foot{
  height: 1.932367rem;
  padding: 0 .386473rem;
  background: -webkit-gradient(linear, 0% 0%, 0% 100%, color-stop(0, rgba(255,255,255,0.1)),color-stop(0.2, rgba(255,255,255,0.9)), color-stop(1, rgba(255,255,255,1)));
  .submit-btn{
    margin-top: .483092rem;
    height: 1.062802rem !important;
    flex: 1;
  }
}
</style>
<style lang="scss">
.delete-member-dialog{
  width: 6.763285rem;
  .van-dialog__header{
    font-weight: bold;
  }
}
</style>