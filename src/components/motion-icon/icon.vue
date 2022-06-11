<template>
  <van-image :src="src"></van-image>
</template>

<script>
import { loadMotionIcon } from '@/config/motion.js'
export default {
  data() {
    return {
      src: ""
    }
  },
  props: {
    type: Number,
    sportType: String,
  },
  created() {
    this.src = loadMotionIcon(this.type, this.sportType)
  }
}
</script>

<style>

</style>