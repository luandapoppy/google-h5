<template>
  <van-image :src="src" round fit="cover">
    <template v-slot:error>
      <img class="error-img" src="/static/image/profile.png">
    </template>
  </van-image>
</template>

<script>
import { getCompleteFileName } from '@/config/fileUtil.js'
export default {
  data() {
    return {
      src: ""
    }
  },
  props: {
    url: String,
  },
  watch: {
    url(val) {
      let url;
      if (val) {
        url = getCompleteFileName(val);
      } else {
        url = '/static/image/profile.png'
      }
      this.$set(this, 'src', url);
    }
  },
  created() {
    if (this.url) {
      this.src = getCompleteFileName(this.url);
    } else {
      this.src = '/static/image/profile.png'
    }
  }
}
</script>

<style soped>
.error-img{
  width: 100%;
  height: 100%;
}
</style>