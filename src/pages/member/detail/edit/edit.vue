<template>
  <section class="child_page">
    <head-top ref="head" :crossover="crossover">
      <div slot="righttool">
        <span class="complete" @click="updateMember">完成</span>
      </div>
    </head-top>
    <div class="content">
      <van-field v-model="member[field]" placeholder="请输入" clearable autofocus />
    </div>
  </section>
</template>

<script>
import headTop from '@/components/header/head.vue';
export default {
  data() {
    return {
      member: {},
      crossover: '昵称',
      field: '',
    }
  },
  computed: {
    currentMember() {
      return this.$store.getters["member/getCurrentMember"]
    },
    members() {
      return this.$store.getters["member/getMembers"]
    }
  },
  components: { headTop },
  created() {
    const memberId = this.$route.query.memberId;
    this.field = this.$route.query.field;
    const member = this.members.find(item => item.memberId == memberId);
    this.member = JSON.parse(JSON.stringify(member))
  },
  methods: {
    updateMember() {
      if (!this.member[this.field]) {
        this.$toast("请输入内容");
        return
      }
      this.$api.updateMember(
        { ...this.member }
      ).then(res => {
        let members = this.members;
        for (let i in members) {
          if (members[i].memberId == this.member.memberId) {
            members[i] = this.member
            if (this.member.memberId == this.currentMember.memberId) {
              this.$store.dispatch("member/changeCurrentMember", this.member)
            }
            break;
          }
        }
        this.$store.dispatch("member/changeMembers", members);
        setTimeout(() => {
          this.$refs.head.goBackThing();
        }, 500)

        this.$toast.success("修改成功");
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "static/css/public.scss";
.content{
  padding: 1.3043rem .3865rem;
}
.van-cell{
  padding: 0;
  /deep/ .van-icon-clear{
    @include topcenter;
    right: 0;
  }
  /deep/ .van-field__control{
    padding: .3865rem .6039rem .3865rem 0;
    border-bottom: .0242rem solid #e3e4e5;
  } 
}
.complete{
  @include sizeColor(.3623rem, $maincolor);
  padding: .3865rem;
}

</style>