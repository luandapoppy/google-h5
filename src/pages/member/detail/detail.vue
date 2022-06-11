<template>
  <section class="child_page">
    <head-top ref="head" :crossover="type=='0'?'成员信息':''">
      <section slot="searchpart" v-if="type!=='0'">
        <van-tabs class="tabs" v-model="active" @change="onTabClick" swipeable>
          <van-tab title="个人信息" name="1"></van-tab>
          <van-tab title="学校信息" name="2"></van-tab>
        </van-tabs>
      </section>
    </head-top>
    <section class="content">
      <section v-show="active=='1'">
        <van-form ref="form" :show-error="false" :show-error-message="false" validate-trigger="onChange">
          <van-field name="uploader" class="upload">
            <template #input>
              <profile-icon :url="form.memberPhotoUrl"></profile-icon>
              <i class="ks-icon ks-icon-camera"></i>
              <input type="file" accept="image/*" @change="changeFile" class="hidden-upload-input">
            </template>
          </van-field>
          <van-field v-model="form.memberName" name="memberName" label="昵称" placeholder="请输入(必填)" @focus="showBtn=false"
            @blur="showBtn=true" :rules="[{ required: true }]" :readonly="type!=='0'" :is-link="type!=='0'"
            @click="fieldClick('memberName')" />
          <van-field :value="formText.genderText" name="gender" label="性别" placeholder="请选择(必填)" readonly clickable
            right-icon="arrow" @click="showGenderPicker = true" :rules="[{ required: true }]" />
          <van-popup v-model="showGenderPicker" position="bottom">
            <van-picker show-toolbar :columns="genderColumns" value-key="name" title="选择性别" @confirm="onGenderConfirm"
              @cancel="showGenderPicker = false" />
          </van-popup>
          <van-field :value="form.birthday" name="birthday" label="生日" placeholder="请选择(必填)" readonly clickable
            right-icon="arrow" @click="showBirthdayPicker = true" :rules="[{ required: true }]" />
          <van-popup v-model="showBirthdayPicker" position="bottom">
            <van-datetime-picker show-toolbar v-model="formText.birthdayText" type="date" title="选择生日"
              :max-date="maxDate" @confirm="onBirthdayConfirm" @cancel="showBirthdayPicker=false" />
          </van-popup>
          <van-field :value="formText.relationshipText" name="relationship" label="关系" placeholder="请选择(必填)" readonly
            clickable right-icon="arrow" @click="showRelationshipPicker = true" :rules="[{ required: true }]" />
          <van-popup v-model="showRelationshipPicker" position="bottom">
            <van-picker show-toolbar :columns="relationshipColumns" value-key="name" @confirm="onRelationshipConfirm"
              @cancel="showRelationshipPicker = false" />
          </van-popup>
          <van-field :value="formText.addressIdText" name="addressId" label="所在地区" placeholder="请选择" readonly clickable
            right-icon="arrow" @click="showAddressIdPickerClick" />
          <van-popup v-model="showAddressIdPicker" position="bottom">
            <!-- <van-picker show-toolbar :columns="addressIdColumns" value-key="name" @confirm="onAddressIdConfirm"
              @cancel="showAddressIdPicker = false" /> -->
            <address-picker v-if="showAddress" @onAddressIdConfirm="onAddressIdConfirm"
              @cancelClick="onAddressIdCancel"></address-picker>
          </van-popup>
          <van-field v-if="type=='0'" v-model="form.addressMoreDetail" rows="3" autosize label="详细地址" type="textarea"
            maxlength="100" placeholder="请输入" show-word-limit />
          <van-field v-else v-model="form.addressMoreDetail" label="详细地址" right-icon="arrow" readonly
            @click="fieldClick('addressMoreDetail')" />

          <!-- 已认证 -->
          <van-field v-if="form.certifiedType && form.certifiedTyp!=='-1'" v-model="form.realName" name="realName"
            label="真实姓名" readonly />
          <van-field v-if="form.certifiedType && form.certifiedTyp!=='-1'" v-model="formText.identificationNoText"
            name="identificationNo" label="身份证号" readonly />

          <van-field name="switch" label="切换为此成员">
            <template #right-icon>
              <van-switch v-model="formText.switchChecked" :disabled="formText.switchDisabled" size="28"
                active-color="#ff7f00" />
            </template>
          </van-field>
        </van-form>
      </section>
      <section v-show="active=='2'" class="school-detail">
        <empty v-if="!form.schoolId" imgUrl="/static/image/empty_noschool.png" text="该成员还未加入任何学校！">
          <div slot class="add-school" @click="addSchool">马上加入学校</div>
        </empty>
        <div v-else>
          <div class="school">
            <i class="ks-icon ks-icon-school"></i>
            <div class="school-detail">
              <div class="school-name">{{form.schoolName}}</div>
              <div class="school-class">{{form.className}}</div>
            </div>
          </div>
          <div class="school-identity">
            <van-cell-group title="校内身份信息" :border="false">
              <van-cell title="真实姓名" :value="form.realName" />
              <van-cell title="身份" :value="form.certifiedType=='0'?'学生':'老师'" />
              <van-cell title="留校手机号" :value="form.phoneNum" />
              <van-cell v-if="form.certifiedType=='0'" title="学号" :value="form.stuNo" />
              <van-cell title="加入时间" :value="form.certifiedTime" />
            </van-cell-group>
          </div>
        </div>
      </section>
    </section>
    <div class="foot">
      <van-button v-if="type=='0' && showBtn" class="primary-btn" round block type="primary" @click="onSubmit">
        <span>添加</span>
      </van-button>
    </div>
    <transition name="router-show">
      <router-view></router-view>
    </transition>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';
import headTop from '@/components/header/head.vue';
import profileIcon from '@/components/profile-icon/icon.vue';
import { compressorImage, uploadFile } from "@/config/fileUtil.js";
import { genderOptions, relationshipOptions } from "@/config/constant.js";
import { formatDateTime } from "@/config/date.js";
import { getStore, setStore } from "@/config/mUtil.js";

export default {
  data() {
    return {
      active: '1',
      type: '0',
      memberId: null,
      formText: {
        genderText: genderOptions[2].name,
        birthdayText: new Date(),
        relationshipText: '',
        addressIdText: '',
        addressMoreDetail: '',
        switchChecked: false,
        switchDisabled: false,
        identificationNoText: ''
      },
      showBtn: true,
      showGenderPicker: false,
      genderColumns: genderOptions,
      showBirthdayPicker: false,
      maxDate: new Date(),
      showRelationshipPicker: false,
      relationshipColumns: relationshipOptions,
      showAddressIdPicker: false,
      showAddress: false, // 是否加载地址选择器组件
      disabled: true
    }
  },
  computed: {
    ...mapGetters({
      currentMember: "member/getCurrentMember",
      members: "member/getMembers"
    }),
    form() {
      const form = this.members.find(item => item.memberId == this.memberId) || {
        gender: genderOptions[2].value,
      };
      if (this.type !== '0') {
        this.formText.birthdayText = new Date(form.birthday);
        this.formText.relationshipText = (relationshipOptions.find(item => item.value == form.relationship) || {}).name;
        this.formText.genderText = genderOptions.find(item => item.value == form.gender).name;
        if (form.addressId && form.addressId !== '') {
          this.formText.addressIdText = form.provinceName + form.cityName + form.countryName
        }
        if (this.currentMember.memberId == this.memberId) {
          this.formText.switchChecked = true;
          this.formText.switchDisabled = true;
        }
        // 身份证号除去首尾 中间隐藏显示
        if (form.identificationNo) {
          const temp = form.identificationNo.split('');
          const first = temp.shift();
          const last = temp.pop() || '';
          this.formText.identificationNoText = first + new Array(temp.length).fill("*").join('') + last
        }
      }
      return form
    }
  },
  components: { headTop, profileIcon, empty: () => import("@/components/empty/empty.vue"), addressPicker: () => import("@/components/address-picker/picker.vue") },
  created() {
    this.memberId = this.$route.query.memberId;
    this.type = this.$route.query.type;
  },
  methods: {
    onTabClick() { },
    // 上传头像
    async changeFile(e) {
      this.$toast.loading();
      let file = e.target.files[0];
      let newFile = await compressorImage(file);
      const result = await uploadFile(newFile);
      this.form.memberPhotoUrl = result.name;
    },
    // 编辑个人信息
    fieldClick(field) {
      if (this.type !== '0') {
        this.$router.push({
          path: "/my/member/detail/edit",
          query: {
            memberId: this.memberId,
            field
          }
        })
      }
    },
    // 性别弹窗
    onGenderConfirm(e) {
      this.form.gender = e.value;
      this.formText.genderText = e.name;
      this.showGenderPicker = false;
      this.updateMember();
    },
    // 日期弹窗
    onBirthdayConfirm(e) {
      this.form.birthday = formatDateTime(e);
      this.formText.birthdayText = e;
      this.showBirthdayPicker = false;
      this.updateMember();
    },
    // 关系弹窗
    onRelationshipConfirm(e) {
      this.form.relationship = e.value;
      this.formText.relationshipText = e.name;
      this.showRelationshipPicker = false;
      this.updateMember();
    },
    // 地址弹窗
    showAddressIdPickerClick() {
      this.showAddressIdPicker = true;
      if (!this.showAddress) {
        this.showAddress = true
      }
    },
    onAddressIdConfirm(address, addressId) {
      this.formText.addressIdText = address.join("");
      this.form.provinceName = address[0];
      this.form.cityName = address[1];
      this.form.countryName = address[2];
      this.form.addressId = addressId;
      this.showAddressIdPicker = false;

      this.updateMember();
    },
    onAddressIdCancel() {
      this.showAddressIdPicker = false;
    },
    // 修改信息
    updateMember() {
      if (this.type == '0') {
        return
      }
      this.$api.updateMember(
        { ...this.form }
      ).then(() => {
        let members = this.members;
        for (let i in members) {
          if (members[i].memberId == this.form.memberId) {
            members[i] = this.form
            break;
          }
        }
        if (this.formText.switchChecked) {
          this.$store.dispatch("member/changeCurrentMember", this.form)
        }
        this.$store.dispatch("member/changeMembers", members);
        this.$toast.success("修改成功");
      })
    },
    // 添加成员
    onSubmit() {
      this.$refs.form.validate().then(() => {
        if (!this.form.memberPhotoUrl) {
          this.form.memberPhotoUrl = this.randomHead();
        }
        const userProfile = JSON.parse(getStore("userProfile"));
        this.$api.addMember(
          { ...this.form, trainingUserId: userProfile.userId, noMember: true }
        ).then(res => {
          this.form.memberId = res.data;
          const members = this.members;
          if (this.formText.switchChecked) {
            this.$store.dispatch("member/changeCurrentMember", this.form)
          }
          members.push(this.form)
          this.$store.dispatch("member/changeMembers", members);
          this.$refs.head.goBackThing();
          this.$toast.success("添加成功");
        })
      }).catch((err) => {
        this.$toast.fail("缺少必填项")
      })
    },
    addSchool() {
      this.$router.push({
        path: '/my/member/addschool',
        query: {
          memberId: this.memberId
        }
      })
    },
    randomHead() {
      let url;
      switch (parseInt(Math.random() * 3)) {
        case 0:
          url = "0_AIKS_IMG/user_default_photo/default_red.png";
          break;
        case 1:
          url = "0_AIKS_IMG/user_default_photo/default_yellow.png"
          break;
        case 2:
          url = "0_AIKS_IMG/user_default_photo/default_green.png"
          break;
        default:
          url = "0_AIKS_IMG/user_default_photo/default_blue.png"
          break;
      }
      return url
    }
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
header{
  .tabs /deep/{
    @include center;
    .van-tab{
      max-width: max-content;
      font-size: .4348rem;
    }
    .van-tabs__nav{
      background-color: transparent;
      justify-content: center;
    }
  }

}
.content{
  padding: 1.3043rem 0 .3865rem;
  height: calc(100% - 1.9324rem);
  box-sizing: border-box;
  .van-form{
    padding: 0 .3865rem;
  }
}
.foot{
  margin: .3865rem;
}
.upload{
  &::after{
    border-bottom: 0;
  }
  .van-image{
    @include widthHeight(2.1014rem, 2.1014rem)
  }
  .ks-icon{
    @include sizeColor(.3623rem, $white);
    @include widthHeight(.6763rem, .6763rem);
    border-radius: 50%;
    background-color: $maincolor;
    display: inline-block;
    line-height: .6763rem;
    position: absolute;
    left: calc(50% + 1.0507rem);
    bottom: 0;
    transform: translateX(-100%);
    text-align: center;
  }
  .hidden-upload-input{
    @include widthHeight(2.1014rem, 2.1014rem);
    position: absolute;
    opacity: 0;
  }
  /deep/ .van-field__control{
    justify-content: center;
  }
}
.van-picker{
  height: 7.2464rem;
}
.van-popup /deep/{
  .van-picker__toolbar{
    background-color: $bgcolor2;
  }
  .van-picker__confirm{
    color: $maincolor
  }
}
.add-school{
  @include sizeColor(.3623rem, $maincolor);
  margin-top: .2415rem;
}
.school{
  @include align;
  padding: .4831rem 0 .4831rem .3865rem ;
  position: relative;
  &::after{
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: .024155rem;
    background-color: $gray1;
    transform: scaleY(0.5)
  }
  .ks-icon{
    @include widthHeight(1.207729rem, 1.207729rem);
    @include sizeColor(.7246rem, $white);
    border: 0;
    flex-shrink: 0;
    text-align: center;
    line-height: 1.2077rem;
    background: #FBE1C9;
    border-radius: 50%;
  }
  .school-detail{
    @include justify(center);
    width: calc(100% - 3.719807rem);
    flex: 1;
    flex-direction: column;
    margin-left: .338164rem;
    .school-name{
      @include sizeColor(.3865rem, #34322E);
      margin-bottom: 0rem;
      line-height: .57971rem;
      font-weight: 500;
      @include align;
    }
    .school-class{
      @include sizeColor(.338164rem, $black6);
    }
  }
}
.school-identity{
  padding: 0 .3865rem;
  .van-cell-group__title{
    @include sizeColor(.3382rem, $black6);
    padding: .3382rem .0966rem;
    font-weight: bold;
  }
}
</style>