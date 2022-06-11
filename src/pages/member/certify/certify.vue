<template>
  <section class="child_page">
    <head-top :crossover="type=='0'?'确认信息':'身份认证'"></head-top>
    <section class="content">
      <div class="tip">请补充并确认加入班级的成员信息</div>
      <van-form ref="form" :show-error="false" :show-error-message="false">
        <van-field :value="form.genderText" name="gender" label="性别" placeholder="请选择(必填)" readonly clickable
          right-icon="arrow" @click="showGenderPicker = true" :rules="[{ required: true }]" />
        <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" close-on-click-action @cancel="onCancel" />
      </van-form>
    </section>
  </section>
</template>

<script>
import headTop from '@/components/header/head.vue';
// import { } from "@/config/"
export default {
  data() {
    return {
      type: '1',// 0扫一扫 1身份认证
      schoolId: '',
      schoolClassId: ''
    }
  },
  components: { headTop },
  created() {
    this.schoolId = this.$route.query.schoolId;
    this.schoolClassId = this.$route.query.schoolClassId;
    this.type = this.$route.query.type;
  }
}
</script>

<style>

</style>