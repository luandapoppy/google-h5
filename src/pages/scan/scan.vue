<template>
  <section class="child_page">
    <head-top ref="head" crossover="扫描二维码">
      <section slot="righttool">
        <span class="photo-album" @click="openPhotoAlbum">相册</span>
      </section>
    </head-top>
    <qrcode></qrcode>
  </section>
</template>

<script>
import headTop from '@/components/header/head.vue';
import qrcode from '@/components/qrcode/qrcode.vue';
export default {
  data() {
    return {}
  },
  components: { headTop, qrcode },
  mounted() {
    setTimeout(() => {
      this.$router.push("/my/member/addschool/invite")
    }, 2000)
  },
  methods: {
    openPhotoAlbum() { }
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/public.scss";
.photo-album{
  padding: 8px;
  @include sizeColor(16px, $black1);
  font-weight: bold;
}
</style>